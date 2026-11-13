/* RootedWord app glue: auth, sync, scaling, translations. */
(function () {
  var SB_URL = "https://bwknqvytaevtypdtpoor.supabase.co";
  var SB_KEY = "sb_publishable_zwpVpbq6_nO-JSIiWECy2w_GKk1Mi72";
  var sb = window.supabase.createClient(SB_URL, SB_KEY, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
  var OSIS = "Gen,Exod,Lev,Num,Deut,Josh,Judg,Ruth,1Sam,2Sam,1Kgs,2Kgs,1Chr,2Chr,Ezra,Neh,Esth,Job,Ps,Prov,Eccl,Song,Isa,Jer,Lam,Ezek,Dan,Hos,Joel,Amos,Obad,Jonah,Mic,Nah,Hab,Zeph,Hag,Zech,Mal,Matt,Mark,Luke,John,Acts,Rom,1Cor,2Cor,Gal,Eph,Phil,Col,1Thess,2Thess,1Tim,2Tim,Titus,Phlm,Heb,Jas,1Pet,2Pet,1John,2John,3John,Jude,Rev".split(",");
  var KEEP = ["hl", "notes", "bm", "marks", "tlNotes", "topics", "trans", "theme"];
  var KV = ["bm", "marks", "tlNotes", "topics", "prefs"];

  var RW = window.RW = { H: 844, S: 1 };
  var session = null, profile = null, root = null;
  var jsonCache = {};
  RW.json = function (url) { if (!jsonCache[url]) jsonCache[url] = fetch(url).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).catch(function (e) { delete jsonCache[url]; throw e; }); return jsonCache[url]; };

  /* ---------- layout ---------- */
  var probe = document.createElement("div");
  probe.style.cssText = "position:fixed;left:0;bottom:0;width:1px;height:env(safe-area-inset-bottom);pointer-events:none;visibility:hidden";
  document.documentElement.appendChild(probe);
  function layout() {
    var W = window.innerWidth, Hh = window.innerHeight - (probe.offsetHeight || 0);
    var s = Math.min(W / 390, Hh / 640);
    RW.S = s; RW.H = Math.floor(Hh / s);
    var el = document.getElementById("app");
    el.style.width = "390px"; el.style.height = RW.H + "px";
    el.style.transform = "scale(" + s + ")";
    el.style.left = Math.max(0, (W - 390 * s) / 2) + "px";
    if (RW.main) RW.main.forceUpdate();
  }
  window.addEventListener("resize", layout);
  window.addEventListener("orientationchange", function () { setTimeout(layout, 200); });
  document.addEventListener("gesturestart", function (e) { e.preventDefault(); });

  /* ---------- user ---------- */
  RW.user = function () {
    var n = (profile && (profile.display_name || profile.username)) || (session && session.user.email) || "Reader";
    var parts = n.replace(/[^A-Za-z0-9 ]/g, " ").trim().split(/\s+/);
    var init = ((parts[0] || "R")[0] + (parts[1] ? parts[1][0] : (parts[0] || "")[1] || "")).toUpperCase();
    return { name: n, init: init };
  };
  var syncState = "idle";
  RW.syncText = function () { return !navigator.onLine ? "Offline · saved on this phone" : syncState === "err" ? "Sync paused · will retry" : syncState === "busy" ? "Syncing…" : "Synced across your devices"; };
  RW.signOut = function () { flush().finally(function () { sb.auth.signOut().then(function () { location.reload(); }); }); };

  /* ---------- install ---------- */
  var deferred = null;
  window.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); deferred = e; if (RW.main) RW.main.forceUpdate(); });
  RW.canInstall = function () { return !!deferred; };
  RW.install = function () { if (deferred) { deferred.prompt(); deferred = null; if (RW.main) RW.main.forceUpdate(); } };

  /* ---------- translations ---------- */
  var tcache = {}, tload = {}, terr = {};
  var NOTICE = {
    KJV: "King James Version · public domain",
    NLT: "Holy Bible, New Living Translation, © 1996, 2004, 2015 by Tyndale House Foundation. Used by permission of Tyndale House Publishers. All rights reserved.",
    ESV: "ESV® Bible © 2001 by Crossway. Used by permission. All rights reserved. esv.org"
  };
  RW.notice = function (t) { return NOTICE[t] || NOTICE.KJV; };
  function parseNLT(html) {
    var d = new DOMParser().parseFromString(html, "text/html"), out = [];
    d.querySelectorAll("verse_export").forEach(function (ve) {
      var vnEl = ve.querySelector(".vn"), n = parseInt(ve.getAttribute("vn") || (vnEl && vnEl.textContent) || "0", 10);
      ve.querySelectorAll(".tn, .a-tn, .vn, h2, h3, .tn-ref").forEach(function (x) { x.remove(); });
      var t = ve.textContent.replace(/\s+/g, " ").trim();
      if (n > 0) out[n - 1] = (out[n - 1] ? out[n - 1] + " " : "") + t;
    });
    for (var i = 0; i < out.length; i++) if (out[i] == null) out[i] = "";
    return out.length ? out : null;
  }
  function parseESV(html) {
    var d = new DOMParser().parseFromString(html, "text/html"), out = [], cur = 0;
    d.querySelectorAll("h2, h3, .footnotes, .extra_text, .copyright").forEach(function (x) { x.remove(); });
    var walker = d.createTreeWalker(d.body, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    var node;
    while ((node = walker.nextNode())) {
      if (node.nodeType === 1 && /\b(verse-num|chapter-num)\b/.test(node.className)) { cur = parseInt(node.textContent.replace(/.*:/, ""), 10) || (node.className.indexOf("chapter-num") >= 0 ? 1 : cur); out[cur - 1] = out[cur - 1] || ""; walker.nextSibling(); continue; }
      if (node.nodeType === 3 && cur > 0 && node.parentNode && !/\b(verse-num|chapter-num)\b/.test(node.parentNode.className)) out[cur - 1] += node.nodeValue;
    }
    out = out.map(function (t) { return (t || "").replace(/\s+/g, " ").trim(); });
    return out.length ? out : null;
  }
  RW.chapter = function (main, S) {
    var t = S.trans; if (!t || t === "KJV") return null;
    var key = t + ":" + S.rb + ":" + S.rc;
    if (tcache[key]) return tcache[key];
    if (!tload[key] && !terr[key]) {
      tload[key] = true;
      sb.functions.invoke("bible", { body: { v: t, ref: OSIS[S.rb] + "." + S.rc } }).then(function (res) {
        tload[key] = false;
        if (res.error || !res.data || res.data.error) throw new Error((res.data && res.data.error) || "error");
        var arr = t === "NLT" ? parseNLT(res.data.html) : parseESV(res.data.html);
        if (!arr) throw new Error("empty");
        tcache[key] = arr; main.forceUpdate();
      }).catch(function () {
        tload[key] = false; terr[key] = true;
        main.toastMsg(navigator.onLine ? t + " couldn't load. Showing KJV." : "You're offline. Showing KJV.");
        setTimeout(function () { delete terr[key]; }, 30000);
        main.setState({ trans: "KJV" });
      });
    }
    return null;
  };
  RW.pickTrans = function (main, t) {
    if (t === "ESV") { main.toastMsg("ESV is coming soon, once the key arrives."); main.setState({ trans: "KJV" }); return; }
    if (!navigator.onLine) { main.toastMsg("NLT needs internet. Showing KJV."); main.setState({ trans: "KJV" }); }
  };

  /* ---------- local + cloud state ---------- */
  function lsKey() { return "rw:" + (session ? session.user.id : "anon"); }
  function loadLocal() { try { return JSON.parse(localStorage.getItem(lsKey()) || "null"); } catch (e) { return null; } }
  function saveLocal(o) { try { localStorage.setItem(lsKey(), JSON.stringify(o)); } catch (e) {} }
  var local = null;   // { data: {...KEEP}, synced: {hl, notes, kv:{}}, dirty: bool }

  RW.wrapMain = function (Base, DEF) {
    return class extends Base {
      constructor(p) { super(p); var st = {}; if (local && local.data) KEEP.forEach(function (k) { if (local.data[k] !== undefined) st[k] = local.data[k]; }); this.state = Object.assign({ tab: "home" }, st); RW.main = this; }
      componentDidUpdate(pp, ps) { if (super.componentDidUpdate) super.componentDidUpdate(pp, ps); changed(this.state, DEF); }
    };
  };
  function pick(state, DEF) { var o = {}; KEEP.forEach(function (k) { o[k] = state[k] !== undefined ? state[k] : DEF[k]; }); return o; }
  var timer = null;
  function changed(state, DEF) {
    var d = pick(state, DEF), s = JSON.stringify(d);
    if (local.lastStr === s) return;
    local.lastStr = s; local.data = d; local.dirty = true; saveLocal(local);
    clearTimeout(timer); timer = setTimeout(flush, 1500);
  }
  function eq(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
  var flushing = null;
  function flush() {
    if (flushing) return flushing.then(function () { return local.dirty ? flush() : null; });
    if (!local || !local.dirty || !session || !navigator.onLine) return Promise.resolve();
    syncState = "busy";
    var uid = session.user.id, d = local.data, sy = local.synced || { hl: {}, notes: {}, kv: {} };
    var ops = [], nextSynced = { hl: Object.assign({}, d.hl), notes: Object.assign({}, d.notes), kv: {} };
    var hlUp = [], hlDel = [];
    Object.keys(d.hl || {}).forEach(function (k) { if (sy.hl[k] !== d.hl[k] && /^(yellow|green|blue|pink|purple|orange)$/.test(d.hl[k])) hlUp.push({ user_id: uid, ref: k, color: d.hl[k], updated_at: new Date().toISOString() }); });
    Object.keys(sy.hl).forEach(function (k) { if (!(d.hl || {})[k]) hlDel.push(k); });
    if (hlUp.length) ops.push(sb.from("highlights").upsert(hlUp));
    if (hlDel.length) ops.push(sb.from("highlights").delete().eq("user_id", uid).in("ref", hlDel));
    var nUp = [], nDel = [];
    Object.keys(d.notes || {}).forEach(function (k) { if (sy.notes[k] !== d.notes[k]) nUp.push({ user_id: uid, ref: k, body: d.notes[k], updated_at: new Date().toISOString() }); });
    Object.keys(sy.notes).forEach(function (k) { if (!(d.notes || {})[k]) nDel.push(k); });
    if (nUp.length) ops.push(sb.from("bible_notes").upsert(nUp));
    if (nDel.length) ops.push(sb.from("bible_notes").delete().eq("user_id", uid).in("ref", nDel));
    var kvVals = { bm: d.bm, marks: d.marks, tlNotes: d.tlNotes, topics: d.topics, prefs: { trans: d.trans, theme: d.theme } };
    var kvUp = [];
    KV.forEach(function (k) { nextSynced.kv[k] = kvVals[k]; if (!eq(sy.kv[k], kvVals[k])) kvUp.push({ user_id: uid, key: k, value: kvVals[k] === undefined ? null : kvVals[k], updated_at: new Date().toISOString() }); });
    kvUp = kvUp.filter(function (r) { return r.value !== null; });
    if (kvUp.length) ops.push(sb.from("user_kv").upsert(kvUp));
    var snapStr = local.lastStr;
    flushing = Promise.all(ops).then(function (res) {
      var bad = res.filter(function (r) { return r && r.error; });
      if (bad.length) throw bad[0].error;
      local.synced = nextSynced;
      if (local.lastStr === snapStr) local.dirty = false;
      saveLocal(local); syncState = "idle";
    }).catch(function (e) { console.warn("sync", e); syncState = "err"; setTimeout(flush, 20000); })
      .finally(function () { flushing = null; if (RW.main && RW.main.state.profile) RW.main.forceUpdate(); });
    return flushing;
  }
  window.addEventListener("online", function () { flush(); });
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") flush(); else pull(false); });

  function pull(first) {
    if (!session || !navigator.onLine) return Promise.resolve();
    var uid = session.user.id;
    return Promise.all([
      sb.from("highlights").select("ref,color").eq("user_id", uid),
      sb.from("bible_notes").select("ref,body").eq("user_id", uid),
      sb.from("user_kv").select("key,value").eq("user_id", uid),
      sb.from("profiles").select("username,display_name").eq("id", uid).maybeSingle()
    ]).then(function (r) {
      if (r[3].data) profile = r[3].data;
      if (r[0].error || r[1].error || r[2].error) throw r[0].error || r[1].error || r[2].error;
      var hl = {}, notes = {}, kv = {};
      r[0].data.forEach(function (x) { hl[x.ref] = x.color; });
      r[1].data.forEach(function (x) { notes[x.ref] = x.body; });
      r[2].data.forEach(function (x) { kv[x.key] = x.value; });
      var empty = !r[0].data.length && !r[1].data.length && !r[2].data.length;
      if (empty) { if (local.data) { local.dirty = true; flush(); } return; }
      if (local.dirty && !first) return flush();
      var prefs = kv.prefs || {};
      var d = Object.assign({}, local.data || {}, { hl: hl, notes: notes });
      ["bm", "marks", "tlNotes", "topics"].forEach(function (k) { if (kv[k] !== undefined) d[k] = kv[k]; });
      if (prefs.trans) d.trans = prefs.trans; if (prefs.theme) d.theme = prefs.theme;
      if (local.dirty && first) { // local edits made offline before this launch: keep them, push
        return flush();
      }
      local.data = d; local.synced = { hl: hl, notes: notes, kv: kv }; local.lastStr = null; saveLocal(local);
      if (RW.main) { var st = {}; KEEP.forEach(function (k) { if (d[k] !== undefined) st[k] = d[k]; }); RW.main.setState(st); }
    }).catch(function (e) { console.warn("pull", e); }).finally(function () { if (RW.main) RW.main.forceUpdate(); });
  }

  /* ---------- auth screen ---------- */
  var A = {};
  function $(id) { return document.getElementById(id); }
  function showAuth(mode, msg) {
    $("auth").style.display = "flex"; $("app").style.display = "none";
    ["signin", "signup", "forgot", "reset"].forEach(function (m) { $("f-" + m).style.display = m === mode ? "flex" : "none"; });
    $("amsg").textContent = msg || ""; $("amsg").className = "amsg";
  }
  function err(m) { $("amsg").textContent = m; $("amsg").className = "amsg bad"; }
  function busy(form, on) { var b = form.querySelector("button[type=submit]"); b.disabled = on; b.style.opacity = on ? 0.6 : 1; }
  function friendly(e) {
    var m = (e && e.message) || String(e);
    if (/Invalid login/i.test(m)) return "That email and password don't match.";
    if (/already registered/i.test(m)) return "That email already has an account. Try signing in.";
    if (/Email not confirmed/i.test(m)) return "Please confirm your email first. Check your inbox.";
    if (/Password should/i.test(m)) return "Password needs at least 6 characters.";
    if (/fetch|network/i.test(m)) return "No internet connection.";
    return m;
  }
  function wireAuth() {
    document.querySelectorAll("[data-go]").forEach(function (b) { b.addEventListener("click", function (e) { e.preventDefault(); showAuth(b.getAttribute("data-go")); }); });
    $("f-signin").addEventListener("submit", function (e) {
      e.preventDefault(); var f = e.target; busy(f, true);
      sb.auth.signInWithPassword({ email: f.email.value.trim(), password: f.password.value }).then(function (r) { busy(f, false); if (r.error) err(friendly(r.error)); });
    });
    $("f-signup").addEventListener("submit", function (e) {
      e.preventDefault(); var f = e.target, u = f.username.value.trim().toLowerCase();
      if (!/^[a-z0-9_.]{3,24}$/.test(u)) return err("Username: 3–24 letters, numbers, _ or .");
      busy(f, true);
      sb.from("profiles").select("id").eq("username", u).maybeSingle().then(function (q) {
        if (q.data) { busy(f, false); return err("That username is taken."); }
        return sb.auth.signUp({ email: f.email.value.trim(), password: f.password.value, options: { data: { username: u, display_name: f.dname.value.trim() || u }, emailRedirectTo: location.origin + location.pathname } }).then(function (r) {
          busy(f, false);
          if (r.error) return err(friendly(r.error));
          if (!r.data.session) showAuth("signin", "Account made. Check your email to confirm, then sign in.");
        });
      });
    });
    $("f-forgot").addEventListener("submit", function (e) {
      e.preventDefault(); var f = e.target; busy(f, true);
      sb.auth.resetPasswordForEmail(f.email.value.trim(), { redirectTo: location.origin + location.pathname }).then(function (r) {
        busy(f, false); if (r.error) return err(friendly(r.error));
        showAuth("signin", "If that email has an account, a reset link is on its way.");
      });
    });
    $("f-reset").addEventListener("submit", function (e) {
      e.preventDefault(); var f = e.target;
      if (f.password.value !== f.password2.value) return err("Passwords don't match.");
      busy(f, true);
      sb.auth.updateUser({ password: f.password.value }).then(function (r) {
        busy(f, false); if (r.error) return err(friendly(r.error));
        A.recovering = false; history.replaceState(null, "", location.pathname); start(r.data.user ? session : session);
      });
    });
  }

  function start(sess) {
    if (A.recovering) return;
    if (!sess) { session = null; showAuth("signin"); return; }
    if (root && session && session.user.id === sess.user.id) { session = sess; return; }
    session = sess;
    local = loadLocal() || { data: null, synced: null, dirty: false };
    if (!local.data) { var anon = null; try { anon = JSON.parse(localStorage.getItem("rw:anon") || "null"); } catch (e) {} if (anon && anon.data) { local.data = anon.data; local.dirty = true; } }
    $("auth").style.display = "none"; $("app").style.display = "block";
    layout();
    if (!root) { root = $("app"); DC.render(DC.h(DC.get("Main"), { startTab: "home" }), root); }
    pull(true);
  }

  if (location.hostname === "localhost") RW._testStart = function () { start({ user: { id: "test", email: "test@example.com" } }); };
  function boot() {
    wireAuth();
    sb.auth.onAuthStateChange(function (ev, sess) {
      if (ev === "PASSWORD_RECOVERY") { A.recovering = true; session = sess; showAuth("reset"); return; }
      if (ev === "SIGNED_OUT") { if (root) location.reload(); else showAuth("signin"); return; }
      if (ev === "SIGNED_IN" || ev === "INITIAL_SESSION" || ev === "TOKEN_REFRESHED" || ev === "USER_UPDATED") setTimeout(function () { start(sess); }, 0);
    });
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(function () {});
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
