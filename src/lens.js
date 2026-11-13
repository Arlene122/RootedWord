/* LensPanel: study help for any verse. Original-language words come from STEPBible data (not AI). Summaries come from AI, grounded in Scripture only. */
(function () {
  var h = DC.h, P = window.preact;
  var TABS = [["verse", "Verse"], ["chapter", "Chapter"], ["book", "Book"], ["who", "Who"], ["orig", "Original"]];
  var memo = {};
  function lsGet(k) { try { return JSON.parse(localStorage.getItem("rwlens:" + k) || "null"); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem("rwlens:" + k, JSON.stringify(v)); } catch (e) {} }

  var lexP = null;
  function lex() { if (!lexP) lexP = RW.json("data/orig/lex.json"); return lexP; }

  class LensPanel extends P.Component {
    constructor(p) { super(p); this.state = { tab: "verse", data: {}, err: {}, busy: {}, lex: null, word: null }; }
    componentDidMount() { this.load(this.state.tab); }
    componentDidUpdate(pp) { if (pp.b !== this.props.b || pp.c !== this.props.c || pp.v !== this.props.v) { this.setState({ data: {}, err: {}, busy: {}, word: null }); var t = this.state.tab, self = this; setTimeout(function () { self.load(t); }, 0); } }
    key(tab) { var p = this.props; return tab === "book" ? "book:" + p.b : tab === "chapter" || tab === "who" ? tab + ":" + p.b + ":" + p.c : tab === "orig" ? "orig:" + p.b + ":" + p.c : "verse:" + p.b + ":" + p.c + ":" + p.v; }
    setTab(t) { this.setState({ tab: t, word: null }); this.load(t); }
    load(tab) {
      var k = this.key(tab), self = this, p = this.props;
      if (this.state.data[k] || this.state.busy[k]) return;
      var put = function (v) { var d = Object.assign({}, self.state.data); d[k] = v; var b = Object.assign({}, self.state.busy); delete b[k]; self.setState({ data: d, busy: b }); };
      var fail = function (m) { var e = Object.assign({}, self.state.err); e[k] = m; var b = Object.assign({}, self.state.busy); delete b[k]; self.setState({ err: e, busy: b }); };
      var b0 = Object.assign({}, this.state.busy); b0[k] = true; var e0 = Object.assign({}, this.state.err); delete e0[k]; this.setState({ busy: b0, err: e0 });
      if (tab === "orig") {
        Promise.all([RW.json("data/orig/" + p.b + "/" + p.c + ".json"), lex()]).then(function (r) { self.setState({ lex: r[1] }); put(r[0]); }).catch(function () { fail(navigator.onLine ? "Couldn't load the original text." : "Open this chapter once while online to keep its original text offline."); });
        return;
      }
      if (memo[k]) return put(memo[k]);
      var cached = lsGet(k); if (cached) { memo[k] = cached; return put(cached); }
      if (!navigator.onLine) return fail("Lens needs internet the first time. Answers you've opened before work offline.");
      RW.lens({ kind: tab, b: p.b, c: p.c, v: p.v, book: p.bookName, ref: tab === "book" ? p.bookName : tab === "verse" ? p.bookName + " " + p.c + ":" + p.v : p.bookName + " " + p.c, text: tab === "verse" ? p.verseText : p.chapterText })
        .then(function (d) { memo[k] = d; lsSet(k, d); put(d); })
        .catch(function (e) { fail(e && e.message ? e.message : "Lens is busy. Try again shortly."); });
    }
    sec(label) { return h("div", { style: "font:600 11px Inter,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#8A5A0E;margin-top:4px" }, label); }
    para(t, big) { return t ? h("div", { style: "font:400 " + (big ? 15 : 14) + "px/1.55 Inter,sans-serif;color:" + (big ? "#2A2520" : "#3B342B") }, t) : null; }
    refChip(r) {
      var self = this, v = this.props.getVerse && this.props.getVerse(r.ref);
      if (!v) return null; // drop anything that is not a real verse
      return h("button", { onClick: function () { self.props.openRef && self.props.openRef(r.ref); }, style: "text-align:left;border:1px solid #EDE6DA;border-radius:12px;padding:10px 12px;background:#FFFDF8;display:flex;flex-direction:column;gap:4px" },
        h("div", { style: "display:flex;justify-content:space-between;gap:8px" }, h("span", { style: "font:700 13px Inter,sans-serif;color:#1F5E5B" }, v.label), h("span", { style: "font:500 11px Inter,sans-serif;color:#8A7F70" }, "Open ›")),
        h("div", { style: "font:italic 400 13.5px/1.45 'Source Serif 4',Georgia,serif;color:#5A5145" }, v.text),
        r.why ? h("div", { style: "font:400 12.5px/1.45 Inter,sans-serif;color:#3B342B" }, r.why) : null);
    }
    refs(list, label) { var self = this; var items = (list || []).map(function (r) { return self.refChip(typeof r === "string" ? { ref: r } : r); }).filter(Boolean); return items.length ? [this.sec(label)].concat(items) : null; }
    grid(rows) { return h("div", { style: "display:grid;grid-template-columns:104px 1fr;gap:9px 12px;font:400 14px/1.45 Inter,sans-serif" }, rows.filter(function (r) { return r[1]; }).map(function (r) { return [h("div", { style: "font:600 12px Inter,sans-serif;color:#6B6255" }, r[0]), h("div", null, r[1])]; })); }
    body() {
      var tab = this.state.tab, k = this.key(tab), d = this.state.data[k], self = this, p = this.props;
      if (this.state.err[k]) return [h("div", { style: "font:400 14px/1.5 Inter,sans-serif;color:#8A2943;background:#FBF1F3;border-radius:12px;padding:12px" }, this.state.err[k]), h("button", { onClick: function () { self.load(tab); }, style: "align-self:flex-start;height:36px;padding:0 14px;border:1px solid #E0D6C5;border-radius:18px;background:#FBF8F2;font:600 12.5px Inter,sans-serif" }, "Try again")];
      if (!d) return [h("div", { style: "font:500 13px Inter,sans-serif;color:#8A7F70;padding:8px 0" }, tab === "orig" ? "Loading the original text…" : "Reading the passage…")];
      if (tab === "verse") return [this.sec("In short"), this.para(d.summary, true), this.sec("Context"), this.para(d.context)].concat(this.refs(d.crossRefs, "Scripture on Scripture") || []);
      if (tab === "chapter") return [this.sec(p.bookName + " " + p.c + " in brief"), this.para(d.summary, true), d.outline && d.outline.length ? this.sec("Flow") : null].concat((d.outline || []).map(function (o) { return h("div", { style: "display:flex;gap:10px;font:400 14px/1.45 Inter,sans-serif" }, h("span", { style: "flex:none;min-width:52px;font:700 12px Inter,sans-serif;color:#1F5E5B" }, "vv. " + o.verses), h("span", null, o.text)); }), [this.sec("Where it sits"), this.para(d.placement)]);
      if (tab === "book") return [this.sec(p.bookName), this.para(d.summary, true), this.sec("Big theme"), this.para(d.theme)].concat((d.outline && d.outline.length ? [this.sec("Shape of the book")] : []), (d.outline || []).map(function (o) { return h("div", { style: "display:flex;gap:10px;font:400 14px/1.45 Inter,sans-serif" }, h("span", { style: "flex:none;min-width:58px;font:700 12px Inter,sans-serif;color:#1F5E5B" }, "ch. " + o.chapters), h("span", null, o.text)); }), this.refs(d.keyVerses, "Key verses") || []);
      if (tab === "who") return [this.grid([["Speaking", d.speaker], ["Written by", d.authorStated], ["Tradition says", d.authorTradition], ["Written to", d.audience], ["Setting", d.setting], ["When", d.when]]), h("div", { style: "font:500 12px/1.5 Inter,sans-serif;color:#6B6255" }, "“Written by” is only filled in when the Bible itself says who wrote it. Tradition is shown separately.")].concat(this.refs(d.refs, "Where the Bible says this") || []);
      if (tab === "orig") {
        var words = d[String(p.v)] || [], heb = p.b < 39, L = this.state.lex || {};
        var sel = this.state.word;
        return [
          h("div", { dir: heb ? "rtl" : "ltr", lang: heb ? "he" : "grc", style: "display:flex;flex-wrap:wrap;gap:8px 10px;justify-content:flex-start" },
            words.map(function (w, i) {
              var on = sel === i;
              return h("button", { onClick: function () { self.setState({ word: on ? null : i }); }, style: "border:1px solid " + (on ? "#1F5E5B" : "#EDE6DA") + ";background:" + (on ? "#E3EEEC" : "#FFFDF8") + ";border-radius:10px;padding:6px 8px;display:flex;flex-direction:column;align-items:center;gap:2px;min-width:44px" },
                h("span", { style: "font:400 " + (heb ? 22 : 18) + "px/1.3 'SBL Hebrew','Times New Roman',serif;color:#2A2520" }, w[0]),
                h("span", { dir: "ltr", style: "font:italic 400 11px Inter,sans-serif;color:#6B6255" }, heb ? w[1].toLowerCase() : w[1]),
                h("span", { dir: "ltr", style: "font:600 11px Inter,sans-serif;color:#1F5E5B;max-width:96px;text-align:center" }, w[2]));
            })),
          sel != null && words[sel] ? (function () {
            var w = words[sel], e = L[w[3]];
            return h("div", { style: "border:1px solid #CFE3DF;background:#F3F8F7;border-radius:12px;padding:12px;display:flex;flex-direction:column;gap:5px" },
              h("div", { style: "display:flex;justify-content:space-between;align-items:baseline;gap:8px" }, h("span", { style: "font:700 14px Inter,sans-serif" }, e ? e[2] : w[2]), h("span", { style: "font:600 11px Inter,sans-serif;color:#6B6255" }, w[3] ? "Strong's " + w[3].replace(/^([HG])0+/, "$1") : "")),
              e ? h("div", { style: "font:400 18px 'Times New Roman',serif" }, e[0] + "  ·  " + e[1]) : null,
              e && e[3] ? h("div", { style: "font:400 13px/1.5 Inter,sans-serif;color:#3B342B" }, e[3]) : null);
          })() : h("div", { style: "font:500 12.5px Inter,sans-serif;color:#6B6255" }, "Tap a word for its dictionary meaning."),
          h("div", { style: "font:500 11px/1.5 Inter,sans-serif;color:#8A7F70" }, (heb ? "Hebrew: STEPBible TAHOT (Leningrad Codex)" : "Greek: STEPBible TAGNT, Textus Receptus, the text behind the KJV") + ". Dictionary: STEPBible lexicons. CC BY 4.0, tyndalehouse.com.")
        ];
      }
      return [];
    }
    render() {
      var self = this, p = this.props;
      return h("div", { style: "position:absolute;inset:0;z-index:40" },
        h("button", { "aria-label": "Close", onClick: p.onClose, style: "position:absolute;inset:0;border:none;background:rgba(30,24,16,0.38)" }),
        h("div", { style: "position:absolute;left:0;right:0;bottom:0;height:80%;background:#FFFDF8;border-radius:22px 22px 0 0;display:flex;flex-direction:column" },
          h("div", { style: "padding:10px 18px 0;display:flex;flex-direction:column;gap:10px" },
            h("div", { style: "align-self:center;width:40px;height:5px;border-radius:3px;background:#DDD3C3" }),
            h("div", { style: "display:flex;align-items:center;gap:8px" },
              h("div", { style: "font:600 18px 'Source Serif 4',Georgia,serif;flex:1" }, "Lens · " + p.bookName + " " + p.c + ":" + p.v),
              h("button", { "aria-label": "Close Lens", onClick: p.onClose, style: "width:40px;height:40px;border:none;background:transparent;color:#4A4236;font:400 26px Inter,sans-serif;line-height:1" }, "×")),
            h("div", { style: "display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:2px;background:#F2ECE1;border-radius:12px;padding:3px" },
              TABS.map(function (t) { var on = self.state.tab === t[0]; return h("button", { onClick: function () { self.setTab(t[0]); }, style: "height:34px;border:none;border-radius:9px;background:" + (on ? "#FFFDF8" : "transparent") + ";color:" + (on ? "#2A2520" : "#6B6255") + ";font:600 12px Inter,sans-serif;box-shadow:" + (on ? "0 1px 3px rgba(40,30,10,0.12)" : "none") }, t[0] === "orig" ? (p.b < 39 ? "Hebrew" : "Greek") : t[1]); }))),
          h("div", { style: "flex:1;overflow-y:auto;padding:14px 18px 22px;display:flex;flex-direction:column;gap:10px" },
            h("div", { style: "font:italic 400 15px/1.5 'Source Serif 4',Georgia,serif;color:#5A5145;padding:10px 12px;background:#F7F3EC;border-radius:12px" }, "“" + (p.verseText || "") + "”"),
            this.body(),
            h("div", { style: "display:flex;gap:8px;flex-wrap:wrap;margin-top:4px" },
              h("button", { onClick: p.onThread, style: "height:38px;padding:0 14px;border:1px solid #E6DED1;border-radius:19px;background:#FBF8F2;color:#2A2520;font:600 12px Inter,sans-serif" }, "See connections")),
            this.state.tab !== "orig" ? h("div", { style: "font:500 11px/1.5 Inter,sans-serif;color:#8A7F70" }, "Written by AI from the Bible text only, with verses you can check. Test it against Scripture (Acts 17:11).") : null)));
    }
  }
  DC.register("LensPanel", LensPanel);
})();
