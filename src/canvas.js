/* StudyCanvas: one infinite board with every topic. Notes can hold notes inside them, revealed as you zoom in. */
(function () {
  var h = DC.h, P = window.preact;
  var CW = 200, CH = 130, K = 0.2, HUB = 84;
  var COLORS = { verse: "#D9A92C", idea: "#2E8A6C", question: "#3A6E9C", link: "#8E4FA3", note: "#B9822A", image: "#8A7F70" };
  var TOPIC_TINT = ["#B9822A", "#2E8A6C", "#3A6E9C", "#B44664", "#8E4FA3", "#C0603A", "#5D7F2E", "#2A6F8A"];
  function uid(p) { return p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  // default positions
  function layoutTopics(topics) {
    var cols = Math.max(1, Math.ceil(Math.sqrt(topics.length)));
    topics.forEach(function (t, i) {
      if (t.tx == null) { t.tx = (i % cols) * 1100; t.ty = Math.floor(i / cols) * 1000; }
      var n = (t.cards || []).length;
      (t.cards || []).forEach(function (c, j) {
        if (c.cx == null) {
          var ring = j < 8 ? 0 : 1, idx = ring ? j - 8 : j, cnt = ring ? Math.max(1, n - 8) : Math.min(8, n);
          var a = -Math.PI / 2 + idx / cnt * Math.PI * 2 + (ring ? Math.PI / cnt : 0), r = ring ? 470 : 280;
          c.cx = Math.round(Math.cos(a) * r - CW / 2); c.cy = Math.round(Math.sin(a) * r * 0.85 - CH / 2);
        }
      });
    });
  }
  function kidSlot(i) { return { cx: 8 + (i % 4) * 47, cy: 64 + Math.floor(i / 4) * 31 }; }
  function ensureKids(n) { (n.kids || []).forEach(function (k, i) { if (k.cx == null) { var s = kidSlot(i); k.cx = s.cx; k.cy = s.cy; } }); }

  class StudyCanvas extends P.Component {
    constructor(p) {
      super(p);
      this.cam = { x: 400, y: 300, z: 0.45 };
      this.state = { edit: null, sheet: null, tick: 0, W: 390, H: 600 };
      this.ptrs = {};
      this.topics = null;
      this.boxRef = P.createRef ? P.createRef() : { current: null };
      this.fileRef = P.createRef ? P.createRef() : { current: null };
    }
    componentDidMount() {
      this.measure();
      this.ro = new ResizeObserver(this.measure.bind(this)); this.ro.observe(this.boxRef.current);
      var self = this; setTimeout(function () { var t = self.props.focus && self.T().find(function (x) { return x.id === self.props.focus; }); if (t) self.flyTo(self.topicBox(t), false); else self.fitAll(false); }, 0);
    }
    componentWillUnmount() { if (this.ro) this.ro.disconnect(); cancelAnimationFrame(this.anim); }
    componentDidUpdate(pp) {
      if (pp.focus !== this.props.focus && this.props.focus) { var t = this.T().find(function (x) { return x.id === this.props.focus; }, this); if (t) this.flyTo(this.topicBox(t), true); }
    }
    measure() { var el = this.boxRef.current; if (!el) return; var W = el.offsetWidth, H = el.offsetHeight; if (W !== this.state.W || H !== this.state.H) this.setState({ W: W, H: H }); }
    T() {
      if (!this.topics || this.srcTopics !== this.props.topics) { this.srcTopics = this.props.topics; this.topics = clone(this.props.topics || []); layoutTopics(this.topics); }
      return this.topics;
    }
    commit() { var t = clone(this.topics); this.srcTopics = null; this.props.onChange && this.props.onChange(t); }
    redraw() { this.setState({ tick: this.state.tick + 1 }); }

    /* ---- geometry ---- */
    topicBox(t) {
      var xs = [t.tx - HUB], ys = [t.ty - HUB], xe = [t.tx + HUB], ye = [t.ty + HUB];
      (t.cards || []).forEach(function (c) { xs.push(t.tx + c.cx); ys.push(t.ty + c.cy); xe.push(t.tx + c.cx + CW); ye.push(t.ty + c.cy + CH); });
      var x = Math.min.apply(0, xs), y = Math.min.apply(0, ys);
      return { x: x, y: y, w: Math.max.apply(0, xe) - x, h: Math.max.apply(0, ye) - y };
    }
    allBox() {
      var b = null; this.T().forEach(function (t) { var q = this.topicBox(t); if (!b) b = q; else { var x = Math.min(b.x, q.x), y = Math.min(b.y, q.y); b = { x: x, y: y, w: Math.max(b.x + b.w, q.x + q.w) - x, h: Math.max(b.y + b.h, q.y + q.h) - y }; } }, this);
      return b || { x: -300, y: -300, w: 600, h: 600 };
    }
    toScreen(x, y) { var c = this.cam; return [(x - c.x) * c.z + this.state.W / 2, (y - c.y) * c.z + this.state.H / 2]; }
    toWorld(sx, sy) { var c = this.cam; return [(sx - this.state.W / 2) / c.z + c.x, (sy - this.state.H / 2) / c.z + c.y]; }
    camFor(b) { var W = this.state.W, H = this.state.H - 70; var z = Math.min(W / (b.w * 1.12), H / (b.h * 1.12)); return { x: b.x + b.w / 2, y: b.y + b.h / 2 - 20 / z, z: z }; }
    flyTo(b, animate) {
      var to = this.camFor(b), from = Object.assign({}, this.cam), self = this;
      if (!animate) { this.cam = to; this.redraw(); return; }
      cancelAnimationFrame(this.anim);
      var t0 = performance.now(), D = 520, lz0 = Math.log(from.z), lz1 = Math.log(to.z);
      var step = function (now) {
        var k = Math.min(1, (now - t0) / D), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        var z = Math.exp(lz0 + (lz1 - lz0) * e);
        self.cam = { x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e, z: z };
        self.redraw();
        if (k < 1) self.anim = requestAnimationFrame(step);
      };
      this.anim = requestAnimationFrame(step);
    }
    fitAll(animate) { this.flyTo(this.allBox(), animate); }

    /* ---- build visible node list ---- */
    collect() {
      var out = [], self = this, W = this.state.W, H = this.state.H, z = this.cam.z;
      var vis = function (b) { var s = self.toScreen(b.x, b.y), sw = b.w * z, sh = b.h * z; return s[0] < W && s[1] < H && s[0] + sw > 0 && s[1] + sh > 0; };
      this.T().forEach(function (t, ti) {
        var tint = TOPIC_TINT[ti % TOPIC_TINT.length];
        var hub = { kind: "hub", t: t, ti: ti, tint: tint, x: t.tx - HUB, y: t.ty - HUB, w: HUB * 2, h: HUB * 2 };
        out.push(hub);
        (t.cards || []).forEach(function (c) {
          var b = { kind: "card", t: t, n: c, path: [c.id], tint: tint, x: t.tx + c.cx, y: t.ty + c.cy, w: CW, h: CH, depth: 0 };
          var rec = function (b) {
            if (b.w * z < 5 || !vis(b)) return;
            out.push(b);
            if (b.w * z > 260 && b.n.kids && b.n.kids.length) {
              ensureKids(b.n);
              var s = b.w / CW;
              b.n.kids.forEach(function (k) { rec({ kind: "card", t: t, n: k, path: b.path.concat(k.id), tint: tint, parent: b, x: b.x + k.cx * s, y: b.y + k.cy * s, w: CW * K * s, h: CH * K * s, depth: b.depth + 1 }); });
            }
          };
          rec(b);
        });
      });
      return out;
    }
    hit(sx, sy) {
      var list = this.lastList || [], best = null, hubHit = null;
      for (var i = 0; i < list.length; i++) {
        var b = list[i], s = this.toScreen(b.x, b.y), sw = b.w * this.cam.z, sh = b.h * this.cam.z;
        if (b.kind === "hub") { var cx = s[0] + sw / 2, cy = s[1] + sh / 2, r = Math.max(sw / 2 * 1.1, 24); if ((sx - cx) * (sx - cx) + (sy - cy) * (sy - cy) <= r * r) { hubHit = b; } continue; }
        if (sx >= s[0] && sy >= s[1] && sx <= s[0] + sw && sy <= s[1] + sh) { if (!best || best.kind === "hub" || b.depth >= best.depth) best = b; }
      }
      return best || hubHit;
    }
    focusNode() { // deepest big node under the centre
      var W = this.state.W, H = this.state.H, best = null, z = this.cam.z, self = this;
      (this.lastList || []).forEach(function (b) { if (b.kind !== "card") return; var s = self.toScreen(b.x, b.y), sw = b.w * z, sh = b.h * z; if (sw > W * 0.55 && W / 2 > s[0] && W / 2 < s[0] + sw && H / 2 > s[1] && H / 2 < s[1] + sh) { if (!best || b.depth > best.depth) best = b; } });
      return best;
    }
    findNode(t, path) { var arr = t.cards, n = null; for (var i = 0; i < path.length; i++) { n = (arr || []).find(function (x) { return x.id === path[i]; }); if (!n) return null; arr = n.kids; } return n; }
    findParentArr(t, path) { var arr = t.cards; for (var i = 0; i < path.length - 1; i++) { var n = arr.find(function (x) { return x.id === path[i]; }); arr = n.kids; } return arr; }

    /* ---- pointers ---- */
    loc(e) { var r = this.boxRef.current.getBoundingClientRect(), k = this.state.W / r.width; return { x: (e.clientX - r.left) * k, y: (e.clientY - r.top) * k }; }
    down(e) {
      if (e.isPrimary) { this.ptrs = {}; this.drag = null; this.pinch = null; }
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch (x) {}
      var p = this.loc(e); this.ptrs[e.pointerId] = p;
      cancelAnimationFrame(this.anim);
      var ids = Object.keys(this.ptrs);
      if (ids.length === 1) {
        var hitB = this.hit(p.x, p.y), ed = this.state.edit;
        var mv = hitB && ed && hitB.t.id === ed && (hitB.kind === "card" || hitB.kind === "hub");
        this.drag = { sx: p.x, sy: p.y, cx: this.cam.x, cy: this.cam.y, moved: false, hit: hitB, move: mv, t0: Date.now() };
        if (mv) { this.drag.orig = hitB.kind === "hub" ? { x: hitB.t.tx, y: hitB.t.ty } : { x: hitB.n.cx, y: hitB.n.cy }; }
      } else if (ids.length === 2) {
        var a = this.ptrs[ids[0]], b = this.ptrs[ids[1]];
        this.drag = null;
        this.pinch = { d: Math.hypot(a.x - b.x, a.y - b.y) || 1, z: this.cam.z, w: this.toWorld((a.x + b.x) / 2, (a.y + b.y) / 2) };
      }
    }
    move(e) {
      if (!this.ptrs[e.pointerId]) return;
      var p = this.loc(e); this.ptrs[e.pointerId] = p;
      var ids = Object.keys(this.ptrs);
      if (ids.length >= 2 && this.pinch) {
        var a = this.ptrs[ids[0]], b = this.ptrs[ids[1]], P0 = this.pinch;
        var z = Math.max(0.02, Math.min(5e6, P0.z * (Math.hypot(a.x - b.x, a.y - b.y) / P0.d)));
        var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        this.cam = { z: z, x: P0.w[0] - (mx - this.state.W / 2) / z, y: P0.w[1] - (my - this.state.H / 2) / z };
        this.redraw(); return;
      }
      var d = this.drag; if (!d) return;
      var dx = p.x - d.sx, dy = p.y - d.sy;
      if (!d.moved && Math.abs(dx) + Math.abs(dy) < 7) return;
      d.moved = true;
      if (d.move) {
        var hb = d.hit, z = this.cam.z;
        if (hb.kind === "hub") { hb.t.tx = Math.round(d.orig.x + dx / z); hb.t.ty = Math.round(d.orig.y + dy / z); }
        else { var s = hb.depth ? (hb.parent.w / CW) : 1; hb.n.cx = Math.round(d.orig.x + dx / z / s); hb.n.cy = Math.round(d.orig.y + dy / z / s); }
        this.redraw(); return;
      }
      this.cam = { x: d.cx - dx / this.cam.z, y: d.cy - dy / this.cam.z, z: this.cam.z };
      this.redraw();
    }
    up(e) {
      if (!this.ptrs[e.pointerId]) return;
      delete this.ptrs[e.pointerId];
      var ids = Object.keys(this.ptrs), d = this.drag;
      if (ids.length === 1) { var q = this.ptrs[ids[0]]; this.pinch = null; this.drag = { sx: q.x, sy: q.y, cx: this.cam.x, cy: this.cam.y, moved: true }; return; }
      if (ids.length) return;
      this.pinch = null; this.drag = null;
      if (!d) return;
      if (d.moved) { if (d.move) this.commit(); return; }
      this.tap(d.hit);
    }
    wheel(e) {
      e.preventDefault();
      var p = this.loc(e);
      if (e.ctrlKey || e.metaKey) {
        var w = this.toWorld(p.x, p.y), z = Math.max(0.02, Math.min(5e6, this.cam.z * Math.exp(-e.deltaY * 0.01)));
        this.cam = { z: z, x: w[0] - (p.x - this.state.W / 2) / z, y: w[1] - (p.y - this.state.H / 2) / z };
      } else {
        this.cam = { x: this.cam.x + e.deltaX / this.cam.z, y: this.cam.y + e.deltaY / this.cam.z, z: this.cam.z };
      }
      this.redraw();
    }
    tap(b) {
      var ed = this.state.edit;
      if (!b) return;
      if (b.kind === "hub") {
        if (ed === b.t.id) return;
        this.setState({ edit: b.t.id }); this.flyTo(this.topicBox(b.t), true); return;
      }
      if (ed && ed === b.t.id) { this.setState({ sheet: { tid: b.t.id, path: b.path } }); return; }
      this.flyTo(b, true);
    }

    /* ---- editing ---- */
    addNode(type) {
      var ed = this.state.edit; if (!ed) return;
      var t = this.T().find(function (x) { return x.id === ed; }); if (!t) return;
      var f = this.focusNode(), node = { id: uid("n"), type: type, ref: "", text: "", links: [] };
      if (f && f.t.id === ed) {
        f.n.kids = f.n.kids || []; var s = kidSlot(f.n.kids.length); node.cx = s.cx; node.cy = s.cy; f.n.kids.push(node);
        this.commit(); this.setState({ sheet: { tid: ed, path: f.path.concat(node.id), fresh: true } });
      } else {
        var w = this.toWorld(this.state.W / 2, this.state.H / 2), cx = w[0] - t.tx - CW / 2, cy = w[1] - t.ty - CH / 2;
        var clash = function (x, y) { if (Math.abs(x + CW / 2) < HUB + CW / 2 && Math.abs(y + CH / 2) < HUB + CH / 2) return true; return (t.cards || []).some(function (c) { return Math.abs(c.cx - x) < CW + 10 && Math.abs(c.cy - y) < CH + 10; }); };
        if (clash(cx, cy)) {
          var found = false;
          for (var ring = 1; ring < 8 && !found; ring++) for (var a = 0; a < 16 && !found; a++) {
            var ang = -Math.PI / 2 + a / 16 * Math.PI * 2, x = Math.cos(ang) * (190 + ring * 110) - CW / 2, y = Math.sin(ang) * (150 + ring * 90) - CH / 2;
            if (!clash(x, y)) { cx = x; cy = y; found = true; }
          }
        }
        node.cx = Math.round(cx); node.cy = Math.round(cy);
        t.cards = t.cards || []; t.cards.push(node);
        this.commit(); this.setState({ sheet: { tid: ed, path: [node.id], fresh: true } });
      }
    }
    pickImage(forSheet) { this.imgFor = forSheet; var el = this.fileRef.current; if (el) { el.value = ""; el.click(); } }
    gotFile(e) {
      var file = e.target.files && e.target.files[0], self = this; if (!file) return;
      var target = this.imgFor;
      RW.uploadImage(file).then(function (ref) {
        var t, n;
        if (target) { t = self.T().find(function (x) { return x.id === target.tid; }); n = t && self.findNode(t, target.path); if (n) { n.img = ref; self.commit(); self.redraw(); } return; }
        self.addNode("image");
        var sh = self.state.sheet; t = self.T().find(function (x) { return x.id === sh.tid; }); n = t && self.findNode(t, sh.path); if (n) { n.img = ref; self.commit(); }
      }).catch(function () { self.props.toast && self.props.toast("Couldn't add that image."); });
    }
    sheetNode() { var s = this.state.sheet; if (!s) return null; var t = this.T().find(function (x) { return x.id === s.tid; }); return t ? { t: t, n: this.findNode(t, s.path) } : null; }
    setField(k, v) { var sn = this.sheetNode(); if (!sn || !sn.n) return; sn.n[k] = v; this.redraw(); clearTimeout(this.ct); var self = this; this.ct = setTimeout(function () { self.commit(); }, 500); }
    del() {
      var s = this.state.sheet, sn = this.sheetNode(); if (!sn || !sn.n) return;
      var arr = this.findParentArr(sn.t, s.path), i = arr.indexOf(sn.n); if (i >= 0) arr.splice(i, 1);
      var id = sn.n.id; (sn.t.cards || []).forEach(function (c) { if (c.links) c.links = c.links.filter(function (l) { return l !== id; }); });
      this.commit(); this.setState({ sheet: null });
    }
    goUp() {
      var f = this.focusNode();
      if (f && f.parent) { this.flyTo(f.parent, true); return; }
      if (f) { this.flyTo(this.topicBox(f.t), true); return; }
      this.fitAll(true);
    }

    /* ---- render ---- */
    renderNode(b) {
      var z = this.cam.z, s = this.toScreen(b.x, b.y), sw = b.w * z, sh = b.h * z, ed = this.state.edit;
      if (b.kind === "hub") {
        var editing = ed === b.t.id, r = sw / 2, fs = Math.max(9, Math.min(20, sw / 7));
        return h("div", { key: "h" + b.t.id, "data-hub": b.t.id, style: "position:absolute;left:" + s[0] + "px;top:" + s[1] + "px;width:" + sw + "px;height:" + sh + "px;border-radius:50%;background:" + (editing ? b.tint : "#FFFDF8") + ";border:" + Math.max(2, sw / 40) + "px solid " + b.tint + ";display:flex;align-items:center;justify-content:center;text-align:center;box-shadow:0 4px 14px rgba(40,30,10,.16);box-sizing:border-box;padding:" + (sw * 0.1) + "px" },
          sw > 70 ? h("div", { style: "font:600 " + fs + "px/1.15 'Source Serif 4',Georgia,serif;color:" + (editing ? "#FFFDF8" : "#2A2520") + ";overflow:hidden" }, b.t.title || "Topic")
            : h("div", { style: "position:absolute;left:50%;top:" + (sh + 4) + "px;transform:translateX(-50%);white-space:nowrap;font:700 11px Inter,sans-serif;color:#2A2520;background:rgba(255,253,248,.92);border-radius:8px;padding:2px 7px;box-shadow:0 1px 4px rgba(40,30,10,.15)" }, b.t.title || "Topic"));
      }
      var n = b.n, k = sw / CW, col = COLORS[n.type] || COLORS.note, kidsShown = sw > 260 && n.kids && n.kids.length;
      var fade = kidsShown ? Math.max(0.12, 1 - (sw - 260) / 500) : 1;
      var editing = ed === b.t.id;
      var kids = [];
      if (sw > 34) {
        var ref = n.ref ? (this.props.getVerse && this.props.getVerse(n.ref)) : null;
        var title = n.ref || (n.type === "question" ? "Question" : n.type === "link" ? "Connection" : n.type === "image" ? "Picture" : "Note");
        kids.push(h("div", { style: "font:700 " + (11 * k) + "px Inter,sans-serif;color:" + col + ";white-space:nowrap;overflow:hidden;text-overflow:ellipsis" }, title));
        var body = n.text || (ref ? ref.text : "");
        if (body && sw > 70) kids.push(h("div", { style: "font:" + (n.ref && !n.text ? "italic 400 " : "400 ") + (12.5 * k) + "px/1.35 " + (n.ref && !n.text ? "'Source Serif 4',Georgia,serif" : "Inter,sans-serif") + ";color:#2A2520;overflow:hidden;display:-webkit-box;-webkit-line-clamp:" + (n.img || (n.kids && n.kids.length) ? 2 : 5) + ";-webkit-box-orient:vertical;margin-top:" + (3 * k) + "px" }, body));
        if (n.img && sw > 50) { var url = RW.imgUrl(n.img, this); if (url) kids.push(h("img", { src: url, alt: "", draggable: false, style: "display:block;width:100%;flex:1;min-height:0;object-fit:cover;border-radius:" + (6 * k) + "px;margin-top:" + (4 * k) + "px;pointer-events:none" })); }
        if (n.kids && n.kids.length && !kidsShown) kids.push(h("div", { style: "position:absolute;right:" + (6 * k) + "px;bottom:" + (5 * k) + "px;font:700 " + (10 * k) + "px Inter,sans-serif;color:#FFFDF8;background:" + col + ";border-radius:" + (8 * k) + "px;padding:" + (1 * k) + "px " + (6 * k) + "px" }, "+" + n.kids.length));
      }
      return h("div", { key: b.path.join("/"), style: "position:absolute;left:" + s[0] + "px;top:" + s[1] + "px;width:" + sw + "px;height:" + sh + "px;background:#FFFDF8;border:" + Math.max(1, 1.5 * k) + "px solid " + (editing ? col : "#E6DED1") + ";border-top:" + Math.max(2, 4 * k) + "px solid " + col + ";border-radius:" + (10 * k) + "px;box-sizing:border-box;padding:" + (8 * k) + "px " + (9 * k) + "px;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 " + (2 * k) + "px " + (8 * k) + "px rgba(40,30,10," + (editing ? ".18" : ".08") + ")" },
        h("div", { style: "opacity:" + fade + ";display:flex;flex-direction:column;min-height:0;flex:1" }, kids));
    }
    renderLines(list) {
      var self = this, z = this.cam.z, segs = [], byId = {};
      list.forEach(function (b) { if (b.kind === "card" && b.depth === 0) byId[b.t.id + ":" + b.n.id] = b; });
      list.forEach(function (b) {
        if (b.kind === "hub") { (b.t.cards || []).forEach(function (c) { var hs = self.toScreen(b.t.tx, b.t.ty), cs = self.toScreen(b.t.tx + c.cx + CW / 2, b.t.ty + c.cy + CH / 2); segs.push(h("line", { x1: hs[0], y1: hs[1], x2: cs[0], y2: cs[1], stroke: b.tint, "stroke-opacity": 0.25, "stroke-width": Math.max(1, 2 * z) })); }); return; }
        if (b.depth !== 0) return;
        (b.n.links || []).forEach(function (l) { var o = byId[b.t.id + ":" + l]; if (!o) return; var a = self.toScreen(b.x + CW / 2, b.y + CH / 2), c = self.toScreen(o.x + CW / 2, o.y + CH / 2); segs.push(h("line", { x1: a[0], y1: a[1], x2: c[0], y2: c[1], stroke: "#8A7F70", "stroke-opacity": 0.45, "stroke-dasharray": "4 4", "stroke-width": Math.max(1, 1.5 * z) })); });
      });
      return h("svg", { width: this.state.W, height: this.state.H, style: "position:absolute;left:0;top:0;pointer-events:none" }, segs);
    }
    btn(label, on, extra) { return h("button", { onClick: on, style: "height:38px;padding:0 13px;border:none;border-radius:19px;background:#FFFDF8;color:#2A2520;font:600 12.5px Inter,sans-serif;box-shadow:0 2px 8px rgba(40,30,10,.18);" + (extra || "") }, label); }
    renderSheet() {
      var sn = this.sheetNode(); if (!sn || !sn.n) return null;
      var n = sn.n, self = this, ref = n.ref && this.props.getVerse ? this.props.getVerse(n.ref) : null;
      var types = [["note", "Note"], ["verse", "Verse"], ["idea", "Idea"], ["question", "Question"], ["link", "Connection"]];
      var url = n.img ? RW.imgUrl(n.img, this) : null;
      return h("div", { style: "position:absolute;inset:0;z-index:30", onPointerDown: function (e) { e.stopPropagation(); }, onWheel: function (e) { e.stopPropagation(); } },
        h("button", { "aria-label": "Close", onClick: function () { self.commit(); self.setState({ sheet: null }); }, style: "position:absolute;inset:0;border:none;background:rgba(30,24,16,.35)" }),
        h("div", { style: "position:absolute;left:0;right:0;bottom:0;max-height:86%;overflow-y:auto;background:#FFFDF8;border-radius:20px 20px 0 0;padding:14px 16px 20px;box-sizing:border-box;display:flex;flex-direction:column;gap:10px" },
          h("div", { style: "display:flex;align-items:center;gap:8px" },
            h("div", { style: "flex:1;font:600 17px 'Source Serif 4',Georgia,serif" }, (sn.t.title || "Topic") + (this.state.sheet.path.length > 1 ? " · inside a note" : "")),
            h("button", { "aria-label": "Done", onClick: function () { self.commit(); self.setState({ sheet: null }); }, style: "height:34px;padding:0 14px;border:none;border-radius:17px;background:#1F5E5B;color:#F7F3EC;font:600 13px Inter,sans-serif" }, "Done")),
          h("div", { style: "display:flex;gap:6px;flex-wrap:wrap" }, types.map(function (tp) { var on = (n.type || "note") === tp[0]; return h("button", { onClick: function () { self.setField("type", tp[0]); }, style: "height:30px;padding:0 11px;border-radius:15px;border:1.5px solid " + (on ? COLORS[tp[0]] : "#E0D6C5") + ";background:" + (on ? COLORS[tp[0]] : "#FFFDF8") + ";color:" + (on ? "#FFFDF8" : "#3B342B") + ";font:600 12px Inter,sans-serif" }, tp[1]); })),
          h("input", { value: n.ref || "", placeholder: "Verse, e.g. John 1:29 (optional)", onInput: function (e) { self.setField("ref", e.target.value); }, style: "height:42px;border:1px solid #E0D6C5;border-radius:10px;padding:0 12px;font:500 15px Inter,sans-serif;background:#FFFDF8" }),
          ref ? h("div", { style: "font:italic 400 14px/1.45 'Source Serif 4',Georgia,serif;color:#5A5145;background:#F7F3EC;border-radius:10px;padding:8px 10px" }, ref.label + " — " + ref.text) : null,
          h("textarea", { value: n.text || "", placeholder: "Write your note…", rows: 4, onInput: function (e) { self.setField("text", e.target.value); }, style: "border:1px solid #E0D6C5;border-radius:10px;padding:10px 12px;font:400 15px/1.45 Inter,sans-serif;resize:vertical;background:#FFFDF8" }),
          url ? h("img", { src: url, alt: "", style: "width:100%;max-height:220px;object-fit:contain;border-radius:10px;background:#F2ECE1" }) : null,
          h("div", { style: "display:flex;gap:8px;flex-wrap:wrap" },
            h("button", { onClick: function () { self.pickImage(self.state.sheet); }, style: "height:38px;padding:0 13px;border:1px solid #E0D6C5;border-radius:19px;background:#FBF8F2;font:600 12.5px Inter,sans-serif;color:#2A2520" }, n.img ? "Change picture" : "Add picture"),
            n.img ? h("button", { onClick: function () { self.setField("img", null); }, style: "height:38px;padding:0 13px;border:1px solid #E0D6C5;border-radius:19px;background:#FBF8F2;font:600 12.5px Inter,sans-serif;color:#2A2520" }, "Remove picture") : null,
            n.ref && ref ? h("button", { onClick: function () { self.props.openRef && self.props.openRef(n.ref); }, style: "height:38px;padding:0 13px;border:1px solid #CFE3DF;border-radius:19px;background:#E3EEEC;font:600 12.5px Inter,sans-serif;color:#1F5E5B" }, "Open in Read") : null,
            h("button", { onClick: function () { var s = self.state.sheet, t = sn.t; var nn = { id: uid("n"), type: "note", ref: "", text: "", links: [] }; n.kids = n.kids || []; var sl = kidSlot(n.kids.length); nn.cx = sl.cx; nn.cy = sl.cy; n.kids.push(nn); self.commit(); self.setState({ sheet: { tid: s.tid, path: s.path.concat(nn.id), fresh: true } }); }, style: "height:38px;padding:0 13px;border:1px solid #E0D6C5;border-radius:19px;background:#FBF8F2;font:600 12.5px Inter,sans-serif;color:#2A2520" }, "Add a note inside"),
            h("button", { onClick: function () { self.del(); }, style: "height:38px;padding:0 13px;border:1px solid #EBC9D1;border-radius:19px;background:#FBF1F3;font:600 12.5px Inter,sans-serif;color:#8A2943;margin-left:auto" }, "Delete")),
          (n.kids && n.kids.length) ? h("div", { style: "font:500 12px/1.45 Inter,sans-serif;color:#6B6255" }, n.kids.length + " note" + (n.kids.length > 1 ? "s" : "") + " inside. Zoom into this card to see them.") : null));
    }
    render() {
      var self = this, list = this.collect(); this.lastList = list;
      var ed = this.state.edit, edT = ed && this.T().find(function (x) { return x.id === ed; });
      var f = this.focusNode();
      var crumbs = []; if (f) { var p = f; while (p) { crumbs.unshift(p); p = p.parent; } }
      var children = [this.renderLines(list)].concat(list.map(function (b) { return self.renderNode(b); }));
      return h("div", { ref: this.boxRef, style: "flex:1;min-height:0;position:relative;overflow:hidden;background:#F4EFE6;background-image:radial-gradient(#E0D6C5 1px,transparent 1px);background-size:22px 22px;touch-action:none;user-select:none;-webkit-user-select:none",
        onPointerDown: this.down.bind(this), onPointerMove: this.move.bind(this), onPointerUp: this.up.bind(this), onPointerCancel: this.up.bind(this), onWheel: this.wheel.bind(this) },
        children,
        // top bar
        h("div", { style: "position:absolute;left:10px;right:10px;top:10px;display:flex;gap:8px;align-items:center;pointer-events:none" },
          ed && edT
            ? h("div", { style: "pointer-events:auto;flex:1;display:flex;align-items:center;gap:8px;background:#2A2520;color:#F7F3EC;border-radius:14px;padding:6px 6px 6px 12px;box-shadow:0 3px 10px rgba(0,0,0,.2)" },
                h("div", { style: "flex:1;min-width:0;font:600 12.5px Inter,sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" }, "Editing · " + (edT.title || "Topic")),
                h("div", { style: "font:500 11px Inter,sans-serif;color:#CFC5B4" }, "Drag to arrange"),
                h("button", { "aria-label": "Stop editing", onPointerDown: function (e) { e.stopPropagation(); }, onClick: function (e) { e.stopPropagation(); self.setState({ edit: null }); }, style: "width:32px;height:32px;border:none;border-radius:16px;background:#F7F3EC;color:#2A2520;font:700 16px Inter,sans-serif;line-height:1" }, "×"))
            : h("div", { style: "pointer-events:auto;font:500 11.5px/1.4 Inter,sans-serif;color:#5A5145;background:rgba(255,253,248,.92);border-radius:12px;padding:7px 10px;box-shadow:0 2px 8px rgba(40,30,10,.1)" }, crumbs.length ? crumbs.map(function (c) { return c.n.ref || (c.n.text || "Note").slice(0, 18); }).join(" › ") : "Tap a topic's centre to arrange it. Tap a card to dive in.")),
        // bottom tools
        h("div", { onPointerDown: function (e) { e.stopPropagation(); }, style: "position:absolute;left:10px;right:10px;bottom:12px;display:flex;gap:7px;justify-content:center;flex-wrap:wrap" },
          ed ? [this.btn("+ Note", function () { self.addNode("note"); }), this.btn("+ Verse", function () { self.addNode("verse"); }), this.btn("+ Picture", function () { self.imgFor = null; self.pickImage(null); })] : null,
          f ? this.btn("↑ Up", function () { self.goUp(); }) : null,
          this.btn("All topics", function () { self.fitAll(true); })),
        h("input", { ref: this.fileRef, type: "file", accept: "image/*", style: "display:none", onChange: this.gotFile.bind(this) }),
        this.renderSheet());
    }
  }
  DC.register("StudyCanvas", StudyCanvas);
})();
