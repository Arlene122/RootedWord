/* dc-lite: renders x-dc templates with Preact. */
(function () {
  var P = window.preact, h = P.h;
  var REG = {};
  var HOLE = /\{\{\s*([^}]+?)\s*\}\}/g;
  var ONE = /^\{\{\s*([^}]+?)\s*\}\}$/;

  function getter(expr) {
    if (/^-?\d+(\.\d+)?$/.test(expr)) { var n = parseFloat(expr); return function () { return n; }; }
    if (expr === "true") return function () { return true; };
    if (expr === "false") return function () { return false; };
    if (expr === "null") return function () { return null; };
    var parts = expr.split(".");
    return function (s) { var v = s[parts[0]]; for (var i = 1; i < parts.length && v != null; i++) v = v[parts[i]]; return v; };
  }
  function strFn(str) {
    var m = ONE.exec(str);
    if (m) return { raw: true, f: getter(m[1]) };
    if (str.indexOf("{{") < 0) return { raw: true, f: function () { return str; } };
    var bits = [], last = 0, mm; HOLE.lastIndex = 0;
    while ((mm = HOLE.exec(str))) { bits.push(str.slice(last, mm.index)); bits.push(getter(mm[1])); last = HOLE.lastIndex; }
    bits.push(str.slice(last));
    return { raw: false, f: function (s) { var o = ""; for (var i = 0; i < bits.length; i++) { var b = bits[i]; if (typeof b === "string") o += b; else { var v = b(s); o += v == null ? "" : v; } } return o; } };
  }
  function camel(k) { return k.replace(/-([a-z])/g, function (_, c) { return c.toUpperCase(); }); }

  function compileNodes(list) { var out = []; for (var i = 0; i < list.length; i++) { var c = compile(list[i]); if (c) out.push(c); } return out; }
  function runAll(fns, s, out) { for (var i = 0; i < fns.length; i++) { var r = fns[i](s); if (Array.isArray(r)) { for (var j = 0; j < r.length; j++) out.push(r[j]); } else if (r !== null && r !== undefined && r !== false) out.push(r); } return out; }

  function compile(node) {
    if (node.nodeType === 3) {
      var t = node.nodeValue;
      if (!/\S/.test(t)) return function () { return " "; };
      var sf = strFn(t);
      return function (s) { var v = sf.f(s); return v == null ? "" : String(v); };
    }
    if (node.nodeType !== 1) return null;
    var tag = node.localName;
    if (tag === "helmet") return null;
    var kids = compileNodes(node.childNodes);
    if (tag === "sc-for") {
      var lf = getter((ONE.exec(node.getAttribute("list") || "") || [0, "x"])[1]), as = node.getAttribute("as") || "item";
      return function (s) {
        var list = lf(s) || [], out = [];
        for (var i = 0; i < list.length; i++) { var sc = Object.create(s); sc[as] = list[i]; runAll(kids, sc, out); }
        return out;
      };
    }
    if (tag === "sc-if") {
      var vf = strFn(node.getAttribute("value") || "").f;
      return function (s) { return vf(s) ? runAll(kids, s, []) : null; };
    }
    var attrs = [];
    for (var i = 0; i < node.attributes.length; i++) {
      var a = node.attributes[i], name = a.name;
      if (name.indexOf("hint-") === 0) continue;
      attrs.push([name, strFn(a.value)]);
    }
    if (tag === "dc-import") {
      var cname = node.getAttribute("name"), pa = attrs.filter(function (x) { return x[0] !== "name"; }).map(function (x) { return [camel(x[0]), x[1]]; });
      return function (s) { var props = {}; pa.forEach(function (x) { props[x[0]] = x[1].f(s); }); var C = REG[cname]; return C ? h(C, props) : null; };
    }
    var isField = tag === "input" || tag === "textarea";
    attrs = attrs.map(function (x) {
      var n = x[0];
      if (n === "onchange" && isField) n = "oninput";
      return [n, x[1]];
    });
    return function (s) {
      var props = {};
      for (var i = 0; i < attrs.length; i++) { var v = attrs[i][1].f(s); if (v !== undefined && v !== null) props[attrs[i][0]] = v; }
      return h(tag, props, runAll(kids, s, []));
    };
  }

  var headDone = {};
  function compileTemplate(name, src) {
    var tpl = document.createElement("template");
    tpl.innerHTML = src;
    var hel = tpl.content.querySelector("helmet");
    if (hel && !headDone[name]) {
      headDone[name] = 1;
      Array.prototype.forEach.call(hel.children, function (el) {
        if (el.tagName === "LINK") { var href = el.getAttribute("href"); if (document.querySelector('link[href="' + href + '"]')) return; }
        if (el.tagName === "STYLE" && /body\s*\{\s*margin\s*:\s*0\s*\}/.test(el.textContent)) return;
        document.head.appendChild(el.cloneNode(true));
      });
    }
    var roots = compileNodes(tpl.content.childNodes).filter(Boolean);
    return function (vals) { var out = runAll(roots, vals, []).filter(function (x) { return typeof x !== "string" || /\S/.test(x); }); return out.length === 1 ? out[0] : h(P.Fragment, null, out); };
  }

  class DCLogic extends P.Component {
    render() { return this.constructor.__tpl(this.renderVals() || {}); }
  }
  window.DCLogic = DCLogic;
  window.DC = {
    define: function (name, src, factory) {
      var C = factory(DCLogic);
      C.__tpl = compileTemplate(name, src);
      C.displayName = name;
      REG[name] = C;
      return C;
    },
    get: function (n) { return REG[n]; },
    register: function (n, C) { REG[n] = C; return C; },
    h: h, render: P.render
  };
})();
