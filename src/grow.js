/* Grow tab: personal learning plan. Plan · Basics · Verses · Quiz · Topics (Miro-style boards). */
(function () {
  var P = window.preact, e = P.h, G = window.GROW;
  var INK = "#2A2520", MUTED = "#6B6255", LINE = "#E6DED1", CARD = "#FFFDF8", PAPER = "#F7F3EC", TEAL = "#1F5E5B";
  var SERIF = "'Source Serif 4', Georgia, serif", HAND = "Caveat, cursive";

  /* ---------- icons (64×64): d = fill silhouette, l = detail lines ---------- */
  var IC = {
    sun: { d: "M32 18a14 14 0 1 1 0 28 14 14 0 0 1 0-28zM30 2h4v10h-4zM30 52h4v10h-4zM2 30h10v4H2zM52 30h10v4H52zM10 13l3-3 7 7-3 3zM44 47l3-3 7 7-3 3zM44 17l7-7 3 3-7 7zM10 51l7-7 3 3-7 7z" },
    ark: { d: "M4 38h56l-9 14H13zM18 25h28v13H18zM14 27 32 15l18 12z", l: "M24 30h4M36 30h4" },
    tent: { d: "M4 54 32 10l28 44z", l: "M32 54V30l-9 24" },
    star: { d: "M32 4l7 20h21L43 36l7 21-18-13-18 13 7-21L4 24h21z" },
    tablets: { d: "M8 56V24a11 11 0 0 1 22 0v32zM34 56V24a11 11 0 0 1 22 0v32z", l: "M13 30h12M13 37h12M13 44h12M39 30h12M39 37h12M39 44h12" },
    staff: { d: "M29 20h5v40h-5zM32 4c8 0 13 6 13 12 0 7-5 9-9 9v-5c2 0 4-2 4-4 0-4-4-7-8-7s-6 2-6 6h-5c0-7 5-11 11-11z" },
    wall: { d: "M4 18h56v40H4z", l: "M4 28h56M4 38h56M4 48h56M18 18v10M38 18v10M28 28v10M48 28v10M18 38v10M38 38v10M28 48v10M48 48v10" },
    trumpet: { d: "M4 38c14 0 32-6 44-22l9-7 3 9c-6 2-9 7-11 11C39 46 22 54 4 50z" },
    sword: { d: "M30 4h4l3 36h-10zM18 40h28v5H18zM29 45h6v9h-6zM27 54h10v6H27z" },
    wheat: { d: "M31 22h2v38h-2zM32 8c3 3 3 7 0 10-3-3-3-7 0-10zM26 16c4 1 6 4 6 8-4-1-6-4-6-8zM38 16c-4 1-6 4-6 8 4-1 6-4 6-8zM26 26c4 1 6 4 6 8-4-1-6-4-6-8zM38 26c-4 1-6 4-6 8 4-1 6-4 6-8zM26 36c4 1 6 4 6 8-4-1-6-4-6-8zM38 36c-4 1-6 4-6 8 4-1 6-4 6-8z" },
    crown: { d: "M8 46 12 18l12 14 8-18 8 18 12-14 4 28zM8 50h48v7H8z" },
    harp: { d: "M14 6c5 0 7 4 7 9 0 15 11 27 31 31v12H14z", l: "M24 22v32M31 32v22M38 40v14M45 45v9" },
    flame: { d: "M32 4c5 13 17 19 17 34a17 17 0 0 1-34 0c0-9 4-13 8-17 0 7 3 11 7 11-2-11 0-19 2-28z" },
    ziggurat: { d: "M6 56h52V46H6zM13 46h38V36H13zM20 36h24V26H20zM27 26h10V14H27z" },
    lion: { d: "M32 6a26 26 0 1 1 0 52 26 26 0 0 1 0-52z", l: "M22 26a3 3 0 1 0 0.1 0M42 26a3 3 0 1 0 0.1 0M26 40c3 4 9 4 12 0M32 32v8M20 14c-4 4-6 10-6 16M44 14c4 4 6 10 6 16" },
    temple: { d: "M6 24 32 8l26 16zM10 26h44v5H10zM12 33h6v19h-6zM24 33h6v19h-6zM36 33h6v19h-6zM48 33h6v19h-6zM6 52h52v6H6z" },
    hourglass: { d: "M14 4h36v6c0 10-12 16-12 22s12 12 12 22v6H14v-6c0-10 12-16 12-22S14 20 14 10z", l: "M24 50h16" },
    scroll: { d: "M12 10h34a7 7 0 0 1 7 7v33a7 7 0 0 1-7 7H18a7 7 0 0 1-7-7V17a7 7 0 0 0-5-7z", l: "M19 22h26M19 30h26M19 38h20" },
    cross: { d: "M28 4h8v16h14v8H36v32h-8V28H14v-8h14z" },
    fish: { d: "M4 32c10-13 28-15 40-4l13-11v30L44 36C32 47 14 45 4 32z", l: "M15 30a2 2 0 1 0 0.1 0" },
    boat: { d: "M6 40h52l-9 13H15zM30 6h3v34h-3zM33 9l19 27H33z" },
    sheep: { d: "M16 24a8 8 0 0 1 14-4 8 8 0 0 1 14 2 8 8 0 0 1 4 15 8 8 0 0 1-10 7H22a8 8 0 0 1-9-8 8 8 0 0 1 3-12zM46 28a8 8 0 1 1 12 7 8 8 0 0 1-12-7zM22 44h5v13h-5zM38 44h5v13h-5z" },
    lamp: { d: "M6 36c0-6 11-10 25-10s22 4 27-4c0 11-6 21-23 21H17C11 43 6 41 6 36zM30 10c3 4 5 7 0 12-4-4-3-7 0-12zM21 44h20l-4 7H25z" },
    well: { d: "M10 34h44v24H10zM8 30h48v4H8zM14 10h4v20h-4zM46 10h4v20h-4zM10 7h44v5H10z", l: "M10 42h44M10 50h44M22 34v8M42 34v8" },
    eye: { d: "M2 32c8-14 20-20 30-20s22 6 30 20c-8 14-20 20-30 20S10 46 2 32z", l: "M32 22a10 10 0 1 0 0.1 0M32 29a3 3 0 1 0 0.1 0" },
    rings: { d: "M22 18a16 16 0 1 1 0 32 16 16 0 0 1 0-32zM42 18a16 16 0 1 1 0 32 16 16 0 0 1 0-32z", l: "M22 25a9 9 0 1 0 0.1 0M42 25a9 9 0 1 0 0.1 0" },
    mountain: { d: "M2 56 22 22l8 12 10-18 22 40z", l: "M36 22l4 6 4-4" },
    shield: { d: "M32 4 54 12v18c0 14-10 24-22 30C20 54 10 44 10 30V12z", l: "M32 14v36M20 28h24" },
    key: { d: "M18 12a13 13 0 1 1 0 26 13 13 0 0 1 0-26zM29 22h29v7h-4v9h-7v-9h-4v6h-7v-6h-7z", l: "M18 21a4 4 0 1 0 0.1 0" },
    heart: { d: "M32 56S5 40 5 22a13 13 0 0 1 27-5 13 13 0 0 1 27 5c0 18-27 34-27 34z" },
    cloud: { d: "M16 48a11 11 0 0 1-1-22 15 15 0 0 1 28-6 13 13 0 0 1 7 28z" },
    tree: { d: "M29 40h6v18h-6zM32 4a18 18 0 0 1 17 26 12 12 0 0 1-9 16H24a12 12 0 0 1-9-16A18 18 0 0 1 32 4z" },
    book: { d: "M4 14c10-4 20-4 28 2 8-6 18-6 28-2v38c-10-4-20-4-28 2-8-6-18-6-28-2z", l: "M32 16v38M10 24c6-2 12-2 16 1M10 32c6-2 12-2 16 1M38 25c4-3 10-3 16-1M38 33c4-3 10-3 16-1" },
    person: { d: "M32 6a11 11 0 1 1 0 22 11 11 0 0 1 0-22zM10 60c0-16 9-26 22-26s22 10 22 26z" },
    apple: { d: "M32 18c12-6 25 2 25 16 0 14-10 24-19 24-3 0-4-2-6-2s-3 2-6 2C17 58 7 48 7 34c0-14 13-22 25-16zM32 18c0-7 4-12 11-13 0 7-4 11-11 13z" },
    door: { d: "M14 58V20a18 18 0 0 1 36 0v38z", l: "M40 38a2 2 0 1 0 0.1 0M8 58h48" },
    coins: { d: "M24 10a16 7 0 1 1 0 14 16 7 0 0 1 0-14zM8 17v8c0 4 7 7 16 7s16-3 16-7v-8c0 4-7 7-16 7S8 21 8 17zM40 32a16 7 0 1 1 0 14 16 7 0 0 1 0-14zM24 39v8c0 4 7 7 16 7s16-3 16-7v-8c0 4-7 7-16 7s-16-3-16-7z" },
    tomb: { d: "M4 58V36a28 28 0 0 1 56 0v22z", l: "M20 58V42a8 8 0 0 1 16 0v16M44 46a8 8 0 1 0 0.1 0" },
    letter: { d: "M6 14h52v36H6z", l: "M6 14l26 20 26-20M6 50l18-16M58 50 40 34" },
    ladder: { d: "M16 4h5v56h-5zM43 4h5v56h-5zM21 10h22v4H21zM21 22h22v4H21zM21 34h22v4H21zM21 46h22v4H21z" },
    rainbow: { d: "M4 52a28 28 0 0 1 56 0h-8a20 20 0 0 0-40 0z", l: "M16 52a16 16 0 0 1 32 0M20 52a12 12 0 0 1 24 0" },
    cup: { d: "M14 8h36c0 19-8 30-16 30h-4c-8 0-16-11-16-30zM29 38h6v12h-6zM19 50h26v7H19z" },
    dove: { d: "M4 30c10-2 16 2 20 8l10-14c4-6 12-8 19-6-4 2-6 4-6 8l9 2-9 4c-2 10-12 16-25 16H11l8-6C11 46 6 40 4 30z" },
    gift: { d: "M8 24h48v10H8zM12 34h40v24H12z", l: "M32 24v34M32 24c-4-8-14-10-14-4 0 4 8 4 14 4zM32 24c4-8 14-10 14-4 0 4-8 4-14 4z" },
    ear: { d: "M26 58c-5 0-8-4-8-9 0-6 9-9 9-15 0-4-3-6-3-11a13 13 0 0 1 26 0c0 11-11 15-11 23 0 7-6 12-13 12z", l: "M30 24a6 6 0 0 1 12 0c0 4-4 6-4 9" },
    anchor: { d: "M29 14a6 6 0 1 1 6 0v6h8v5h-8v28c8-1 13-6 15-13l-5 1 8-10 6 12-5-2c-3 13-12 19-26 19S10 54 7 41l-5 2 6-12 8 10-5-1c2 7 7 12 15 13V25h-8v-5h8z" },
    seed: { d: "M30 30h4v28h-4zM32 32C19 32 11 24 11 11c13 0 21 8 21 21zM32 28c0-11 8-19 21-19 0 11-8 19-21 19z" },
    bubble: { d: "M8 8h48v34H28L14 56V42H8z", l: "M18 20h28M18 29h20" },
    globe: { d: "M32 4a28 28 0 1 1 0 56 28 28 0 0 1 0-56z", l: "M4 32h56M32 4c-10 10-10 46 0 56M32 4c10 10 10 46 0 56M10 16h44M10 48h44" },
    bulb: { d: "M32 4a18 18 0 0 1 10 33v7H22v-7A18 18 0 0 1 32 4zM24 48h16v4H24zM26 54h12v5H26z" }
  };
  var IC_NAMES = Object.keys(IC);

  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rnd(seed) { var x = seed || 1; return function () { x = (x * 1664525 + 1013904223) >>> 0; return x / 4294967296; }; }
  function blob(r, seed) {
    var R = rnd(seed), pts = [], n = 9;
    for (var i = 0; i < n; i++) { var a = i / n * Math.PI * 2, rr = r * (0.86 + R() * 0.22); pts.push([32 + Math.cos(a) * rr, 32 + Math.sin(a) * rr]); }
    var d = "M" + pts[0][0].toFixed(1) + " " + pts[0][1].toFixed(1);
    for (var j = 0; j < n; j++) { var p = pts[j], q = pts[(j + 1) % n], m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]; d += "Q" + p[0].toFixed(1) + " " + p[1].toFixed(1) + " " + m[0].toFixed(1) + " " + m[1].toFixed(1); }
    return d + "Z";
  }

  /* Art: one icon in a style. style: graffiti | stencil | sketch | cartoon */
  function art(name, color, size, style, seed) {
    var ic = IC[name] || IC.star; color = color || "#B9822A"; style = style || "graffiti"; seed = seed || hash(name + color);
    var kids = [], R = rnd(seed);
    if (style === "graffiti") {
      kids.push(e("path", { d: blob(29, seed), fill: color, opacity: 0.9 }));
      for (var i = 0; i < 18; i++) { var a = R() * 6.283, rr = 27 + R() * 6; kids.push(e("circle", { cx: 32 + Math.cos(a) * rr, cy: 32 + Math.sin(a) * rr, r: 0.5 + R() * 1.3, fill: color, opacity: 0.55 })); }
      kids.push(e("g", { transform: "translate(32 32) scale(0.62) translate(-32 -32)" }, e("path", { d: ic.d, fill: INK, "fill-rule": "evenodd" }), ic.l ? e("path", { d: ic.l, fill: "none", stroke: "#FFF8EA", "stroke-width": 2.4, "stroke-linecap": "round" }) : null));
      kids.push(e("path", { d: blob(30, seed + 7), fill: "none", stroke: INK, "stroke-width": 1, opacity: 0.35, transform: "rotate(" + (R() * 20 - 10) + " 32 32)" }));
    } else if (style === "stencil") {
      kids.push(e("path", { d: ic.d, fill: color, "fill-rule": "evenodd" }));
      if (ic.l) kids.push(e("path", { d: ic.l, fill: "none", stroke: PAPER, "stroke-width": 2.6, "stroke-linecap": "round" }));
    } else if (style === "sketch") {
      kids.push(e("path", { d: ic.d, fill: color, opacity: 0.18, transform: "translate(2 2)" }));
      kids.push(e("path", { d: ic.d, fill: "none", stroke: INK, "stroke-width": 1.6, "stroke-linejoin": "round" }));
      kids.push(e("path", { d: ic.d, fill: "none", stroke: INK, "stroke-width": 0.8, opacity: 0.5, transform: "translate(1.2 -0.8) rotate(1 32 32)" }));
      if (ic.l) kids.push(e("path", { d: ic.l, fill: "none", stroke: INK, "stroke-width": 1.2, "stroke-linecap": "round" }));
    } else {
      kids.push(e("path", { d: ic.d, fill: color, stroke: INK, "stroke-width": 2.4, "stroke-linejoin": "round", "fill-rule": "evenodd" }));
      if (ic.l) kids.push(e("path", { d: ic.l, fill: "none", stroke: INK, "stroke-width": 1.8, "stroke-linecap": "round" }));
      kids.push(e("path", { d: "M18 18c3-3 7-4 10-4", fill: "none", stroke: "#FFFFFF", "stroke-width": 2.5, "stroke-linecap": "round", opacity: 0.7 }));
    }
    return e("svg", { width: size, height: size, viewBox: "-2 -2 68 68", style: { display: "block", flex: "none", overflow: "visible" } }, kids);
  }
  function duo(icons, color, size, seed) { // two icons overlapping for era scenes
    return e("div", { style: { position: "relative", width: size, height: size, flex: "none" } },
      e("div", { style: { position: "absolute", left: 0, top: 0 } }, art(icons[0], color, size * 0.78, "graffiti", seed)),
      icons[1] ? e("div", { style: { position: "absolute", right: 0, bottom: 0 } }, art(icons[1], "#FFF8EA", size * 0.5, "cartoon", seed + 3)) : null);
  }

  /* ---------- helpers ---------- */
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function uid(p) { return (p || "i") + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function today(off) { var d = new Date(); d.setDate(d.getDate() + (off || 0)); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function daysBetween(a, b) { return Math.round((new Date(b) - new Date(a)) / 864e5); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  var SEC = {}; G.SECTIONS.forEach(function (s) { SEC[s.id] = s; });
  var BOOKI = {}; G.BOOKS.forEach(function (b, i) { BOOKI[b[0]] = i; });
  var BOX_DAYS = [0, 1, 2, 4, 8, 16, 32];

  function vtext(getVerse, ref) {
    if (!getVerse) return "";
    var parts = String(ref).split(";"), out = [];
    parts.forEach(function (r) {
      var m = /^\s*(.+?)\s+(\d+):(\d+)(?:-(\d+))?\s*$/.exec(r); if (!m) return;
      var a = +m[3], b = m[4] ? +m[4] : a;
      for (var v = a; v <= Math.min(b, a + 12); v++) { var x = getVerse(m[1] + " " + m[2] + ":" + v); if (x) out.push((b > a ? v + " " : "") + x.text); }
    });
    return out.join(" ");
  }
  function firstRef(r) { return String(r).split(";")[0].trim(); }

  /* ---------- UI atoms ---------- */
  function btn(label, onClick, o) {
    o = o || {};
    return e("button", { onClick: onClick, style: Object.assign({ height: o.h || 38, padding: "0 14px", border: o.ghost ? "1px solid " + LINE : "none", borderRadius: 12, background: o.ghost ? CARD : (o.bg || TEAL), color: o.ghost ? INK : "#F7F3EC", font: "600 13px Inter, sans-serif", whiteSpace: "nowrap", flex: o.flex || "none" }, o.style || {}) }, label);
  }
  function chip(label, on, onClick, color) {
    return e("button", { onClick: onClick, style: { height: 32, padding: "0 12px", borderRadius: 16, border: "1px solid " + (on ? (color || TEAL) : LINE), background: on ? (color || TEAL) : CARD, color: on ? "#FFF" : INK, font: "600 12px Inter, sans-serif", whiteSpace: "nowrap", flex: "none" } }, label);
  }
  function card(kids, o) { o = o || {}; return e("div", { onClick: o.onClick, style: Object.assign({ background: CARD, border: "1px solid " + LINE, borderRadius: 16, padding: 14 }, o.style || {}) }, kids); }
  function h2(t, sub) { return e("div", { style: { margin: "18px 2px 8px" } }, e("div", { style: { font: "600 18px " + SERIF } }, t), sub ? e("div", { style: { font: "500 12px Inter, sans-serif", color: MUTED, marginTop: 2 } }, sub) : null); }
  function tick(on, onClick, color) {
    return e("button", { onClick: function (ev) { ev.stopPropagation(); onClick(); }, "aria-label": on ? "Done" : "Not done", style: { width: 28, height: 28, borderRadius: 9, border: "2px solid " + (on ? (color || TEAL) : "#CFC4B2"), background: on ? (color || TEAL) : "transparent", color: "#FFF", font: "700 15px Inter", flex: "none", padding: 0 } }, on ? "✓" : "");
  }
  function ring(val, max, label, color) {
    var p = max ? Math.min(1, val / max) : 0, C = 2 * Math.PI * 22;
    return e("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: 1 } },
      e("svg", { width: 58, height: 58, viewBox: "0 0 58 58" },
        e("circle", { cx: 29, cy: 29, r: 22, fill: "none", stroke: "#EFE7DA", "stroke-width": 7 }),
        e("circle", { cx: 29, cy: 29, r: 22, fill: "none", stroke: color, "stroke-width": 7, "stroke-linecap": "round", "stroke-dasharray": (C * p) + " " + C, transform: "rotate(-90 29 29)" }),
        e("text", { x: 29, y: 33, "text-anchor": "middle", style: { font: "700 13px Inter" }, fill: INK }, val)),
      e("div", { style: { font: "600 10.5px Inter, sans-serif", color: MUTED, textAlign: "center" } }, label));
  }

  /* =====================================================================
     Board: Miro-style space. Items: sticky, text, verse, shape, stamp, ink. Links connect items.
     ===================================================================== */
  var STICKY = ["#F7DC6F", "#F6B5C0", "#A8D8DC", "#BFE3AE", "#D9C8F2", "#FFD3A6", "#FFFDF8"];
  var PEN = ["#2A2520", "#1F5E5B", "#B44664", "#3A6E9C", "#C0603A", "#8E4FA3", "#D9A92C"];
  var TOOLS = [["move", "Move", "M12 3v18M3 12h18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3"], ["sticky", "Note", "M5 4h14v11l-5 5H5zM14 20v-5h5"], ["text", "Text", "M5 6V4h14v2M12 4v16M9 20h6"], ["verse", "Verse", "M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 21V5M9 7h6"], ["shape", "Shape", "M4 6h9v9H4zM17 13a4 4 0 1 1 0 8 4 4 0 0 1 0-8z"], ["pen", "Draw", "M4 20l4-1L19 8l-3-3L5 16zM14 7l3 3"], ["stamp", "Stencil", "M12 3l2.6 6 6.4.5-4.9 4.2 1.5 6.3L12 16.6 6.4 20l1.5-6.3L3 9.5 9.4 9z"], ["link", "Connect", "M7 7a3 3 0 1 1 0 .1M17 17a3 3 0 1 1 0 .1M9 9l6 6"]];

  function itemRect(it) { return { x: it.x, y: it.y, w: it.w || 10, h: it.h || 10 }; }
  function edgePt(r, tx, ty) {
    var cx = r.x + r.w / 2, cy = r.y + r.h / 2, dx = tx - cx, dy = ty - cy;
    if (!dx && !dy) return [cx, cy];
    var sx = dx ? (r.w / 2) / Math.abs(dx) : Infinity, sy = dy ? (r.h / 2) / Math.abs(dy) : Infinity, s = Math.min(sx, sy);
    return [cx + dx * s, cy + dy * s];
  }

  class Board extends P.Component {
    constructor(p) {
      super(p);
      var b = clone(p.board || { items: [], links: [] });
      this.cam = b.cam || { x: 20, y: 20, z: 0.8 };
      this.state = { b: b, tool: "move", sel: null, linkFrom: null, sheet: null, pen: PEN[0], penW: 4, stampStyle: "graffiti", stampIcon: "star", stampColor: "#B44664", t: 0, W: 390, H: 500, draft: null };
      this.ptrs = {}; this.undo = []; this.box = P.createRef(); this.g = null;
    }
    componentDidMount() {
      var self = this;
      this.measure(); this.ro = new ResizeObserver(function () { self.measure(); }); this.ro.observe(this.box.current);
      if (!this.props.board || !this.props.board.cam) setTimeout(function () { self.fit(); }, 30);
    }
    componentWillUnmount() { if (this.ro) this.ro.disconnect(); }
    measure() { var el = this.box.current; if (el) this.setState({ W: el.offsetWidth, H: el.offsetHeight }); }
    commit(nb) {
      this.undo.push(JSON.stringify(this.state.b)); if (this.undo.length > 40) this.undo.shift();
      nb.cam = { x: Math.round(this.cam.x), y: Math.round(this.cam.y), z: +this.cam.z.toFixed(3) };
      this.setState({ b: nb }); this.props.onChange(nb);
    }
    doUndo() { if (!this.undo.length) return; var nb = JSON.parse(this.undo.pop()); this.setState({ b: nb, sel: null }); this.props.onChange(nb); }
    saveCam() { var nb = Object.assign({}, this.state.b, { cam: { x: Math.round(this.cam.x), y: Math.round(this.cam.y), z: +this.cam.z.toFixed(3) } }); this.state.b = nb; this.props.onChange(nb); }
    fit() {
      var its = this.state.b.items; if (!its.length) { this.cam = { x: 20, y: 20, z: 0.8 }; this.setState({ t: this.state.t + 1 }); return; }
      var x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      its.forEach(function (it) { var r = itemRect(it); x0 = Math.min(x0, r.x); y0 = Math.min(y0, r.y); x1 = Math.max(x1, r.x + r.w); y1 = Math.max(y1, r.y + r.h); });
      var W = this.state.W, H = this.state.H, z = Math.min(1.4, Math.max(0.12, Math.min((W - 30) / (x1 - x0 || 1), (H - 30) / (y1 - y0 || 1))));
      this.cam = { z: z, x: W / 2 - (x0 + x1) / 2 * z, y: H / 2 - (y0 + y1) / 2 * z };
      this.setState({ t: this.state.t + 1 }); this.saveCam();
    }
    local(ev) { var el = this.box.current, r = el.getBoundingClientRect(), s = r.width / el.offsetWidth; return [(ev.clientX - r.left) / s, (ev.clientY - r.top) / s]; }
    world(p) { return [(p[0] - this.cam.x) / this.cam.z, (p[1] - this.cam.y) / this.cam.z]; }
    find(id) { return this.state.b.items.filter(function (i) { return i.id === id; })[0]; }

    down(ev) {
      var t = ev.target, el = this.box.current; el.setPointerCapture && el.setPointerCapture(ev.pointerId);
      var p = this.local(ev); this.ptrs[ev.pointerId] = p;
      var ids = Object.keys(this.ptrs);
      if (ids.length === 2) { // pinch
        var a = this.ptrs[ids[0]], b = this.ptrs[ids[1]];
        if (this.g && this.g.kind === "ink" && this.state.draft) this.setState({ draft: null });
        this.g = { kind: "pinch", d: Math.hypot(a[0] - b[0], a[1] - b[1]) || 1, m: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], cam: Object.assign({}, this.cam), dragging: this.g && this.g.kind === "drag" ? null : null };
        return;
      }
      if (ids.length > 2) return;
      var hitEl = t.closest ? t.closest("[data-id]") : null, handle = t.closest ? t.closest("[data-handle]") : null;
      var id = hitEl ? hitEl.getAttribute("data-id") : null, tool = this.state.tool;
      this.g = { kind: null, start: p, last: p, moved: 0, id: id };
      if (handle) { this.g.kind = "resize"; this.g.id = handle.getAttribute("data-handle"); this.g.orig = clone(this.find(this.g.id)); return; }
      if (tool === "pen") { var w = this.world(p); this.g.kind = "ink"; this.setState({ draft: [[Math.round(w[0]), Math.round(w[1])]] }); return; }
      if (id && (tool === "move" || tool === "link")) { this.g.kind = "drag"; this.g.orig = clone(this.find(id)); return; }
      this.g.kind = "pan"; this.g.cam = Object.assign({}, this.cam);
    }
    move(ev) {
      if (!this.ptrs[ev.pointerId]) return;
      var p = this.local(ev); this.ptrs[ev.pointerId] = p; var g = this.g; if (!g) return;
      if (g.kind === "pinch") {
        var ids = Object.keys(this.ptrs); if (ids.length < 2) return;
        var a = this.ptrs[ids[0]], b = this.ptrs[ids[1]], d = Math.hypot(a[0] - b[0], a[1] - b[1]), m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
        var z = Math.min(4, Math.max(0.08, g.cam.z * d / g.d)), wx = (g.m[0] - g.cam.x) / g.cam.z, wy = (g.m[1] - g.cam.y) / g.cam.z;
        this.cam = { z: z, x: m[0] - wx * z, y: m[1] - wy * z }; this.setState({ t: this.state.t + 1 }); return;
      }
      g.moved = Math.max(g.moved, Math.hypot(p[0] - g.start[0], p[1] - g.start[1]));
      var dx = (p[0] - g.start[0]) / this.cam.z, dy = (p[1] - g.start[1]) / this.cam.z;
      if (g.kind === "pan") { this.cam = { z: this.cam.z, x: g.cam.x + p[0] - g.start[0], y: g.cam.y + p[1] - g.start[1] }; this.setState({ t: this.state.t + 1 }); }
      else if (g.kind === "ink") { var w = this.world(p), dr = this.state.draft || [], l = dr[dr.length - 1]; if (!l || Math.hypot(w[0] - l[0], w[1] - l[1]) > 2 / this.cam.z) this.setState({ draft: dr.concat([[Math.round(w[0]), Math.round(w[1])]]) }); }
      else if ((g.kind === "drag" || g.kind === "resize") && g.moved > 4) {
        var o = g.orig, items = this.state.b.items.map(function (it) {
          if (it.id !== o.id) return it;
          var n = Object.assign({}, it);
          if (g.kind === "drag") { if (it.type === "ink") n.pts = o.pts.map(function (q) { return [Math.round(q[0] + dx), Math.round(q[1] + dy)]; }); n.x = Math.round(o.x + dx); n.y = Math.round(o.y + dy); }
          else { n.w = Math.max(40, Math.round(o.w + dx)); n.h = it.type === "stamp" ? n.w : Math.max(30, Math.round(o.h + dy)); }
          return n;
        });
        this.setState({ b: Object.assign({}, this.state.b, { items: items }) });
      }
    }
    up(ev) {
      var p = this.ptrs[ev.pointerId]; delete this.ptrs[ev.pointerId];
      var g = this.g; if (!g) return;
      if (g.kind === "pinch") { if (Object.keys(this.ptrs).length === 0) { this.g = null; this.saveCam(); } else this.g = { kind: "none" }; return; }
      this.g = null;
      var tap = g.moved < 6, tool = this.state.tool;
      if (g.kind === "pan") {
        if (!tap) { this.saveCam(); return; }
        if (tool === "move" || tool === "link") { this.setState({ sel: null, linkFrom: null }); return; }
        var w = this.world(p || g.start); this.place(tool, w[0], w[1]); return;
      }
      if (g.kind === "ink") {
        var dr = this.state.draft; this.setState({ draft: null });
        if (dr && dr.length > 1) {
          var xs = dr.map(function (q) { return q[0]; }), ys = dr.map(function (q) { return q[1]; });
          var x0 = Math.min.apply(null, xs), y0 = Math.min.apply(null, ys);
          var it = { id: uid("k"), type: "ink", pts: dr, color: this.state.pen, sw: this.state.penW, x: x0, y: y0, w: Math.max.apply(null, xs) - x0 + 1, h: Math.max.apply(null, ys) - y0 + 1 };
          this.commit(Object.assign({}, this.state.b, { items: this.state.b.items.concat([it]) }));
        }
        return;
      }
      if (g.kind === "drag" || g.kind === "resize") {
        if (!tap) { // finished move: recompute ink bounds handled by x/y shift
          var nb = clone(this.state.b); this.state.b = JSON.parse(JSON.stringify(Object.assign({}, nb, { items: nb.items.map(function (it) { return it.id === g.orig.id ? g.orig : it; }) }))); this.commit(nb); return;
        }
        if (tool === "link" || this.state.linkFrom) {
          var from = this.state.linkFrom;
          if (!from) { this.setState({ linkFrom: g.id, sel: g.id }); this.props.toast && this.props.toast("Now tap the box to connect to"); return; }
          if (from !== g.id) {
            var exists = this.state.b.links.some(function (l) { return (l.a === from && l.b === g.id) || (l.b === from && l.a === g.id); });
            if (!exists) this.commit(Object.assign({}, this.state.b, { links: this.state.b.links.concat([{ id: uid("l"), a: from, b: g.id }]) }));
          }
          this.setState({ linkFrom: null, sel: g.id }); return;
        }
        var self = this, was = this.state.sel === g.id, it2 = this.find(g.id);
        this.setState({ sel: g.id });
        if (was && it2 && it2.type !== "ink" && it2.type !== "stamp") this.edit(it2);
      }
    }
    place(tool, x, y) {
      var it;
      if (tool === "sticky") it = { type: "sticky", w: 170, h: 130, color: STICKY[this.state.b.items.length % 5], text: "" };
      else if (tool === "text") it = { type: "text", w: 220, h: 50, color: INK, text: "", size: 22 };
      else if (tool === "verse") it = { type: "verse", w: 240, h: 150, ref: "", text: "" };
      else if (tool === "shape") it = { type: "shape", shape: "rect", w: 160, h: 110, color: "#3A6E9C", text: "" };
      else if (tool === "stamp") it = { type: "stamp", w: 110, h: 110, icon: this.state.stampIcon, color: this.state.stampColor, style: this.state.stampStyle };
      if (!it) return;
      it.id = uid("n"); it.x = Math.round(x - it.w / 2); it.y = Math.round(y - it.h / 2);
      this.commit(Object.assign({}, this.state.b, { items: this.state.b.items.concat([it]) }));
      this.setState({ sel: it.id, tool: tool === "stamp" ? "stamp" : "move" });
      if (tool !== "stamp" && tool !== "shape") this.edit(it);
    }
    edit(it) { this.setState({ sheet: { kind: "edit", id: it.id, text: it.text || "", label: it.label || "", ref: it.ref || "", note: it.note || "" } }); }
    patch(id, ch) { this.commit(Object.assign({}, this.state.b, { items: this.state.b.items.map(function (it) { return it.id === id ? Object.assign({}, it, ch) : it; }) })); }
    del(id) { var b = this.state.b; this.commit({ items: b.items.filter(function (i) { return i.id !== id; }), links: b.links.filter(function (l) { return l.a !== id && l.b !== id; }) }); this.setState({ sel: null }); }
    dup(id) { var it = clone(this.find(id)); it.id = uid("n"); it.x += 30; it.y += 30; if (it.pts) it.pts = it.pts.map(function (q) { return [q[0] + 30, q[1] + 30]; }); this.commit(Object.assign({}, this.state.b, { items: this.state.b.items.concat([it]) })); this.setState({ sel: it.id }); }
    front(id) { var b = this.state.b, it = this.find(id); this.commit(Object.assign({}, b, { items: b.items.filter(function (i) { return i.id !== id; }).concat([it]) })); }

    renderItem(it) {
      var sel = this.state.sel === it.id || this.state.linkFrom === it.id, z = this.cam.z, self = this;
      var base = { position: "absolute", left: it.x, top: it.y, width: it.w, height: it.h, boxSizing: "border-box", touchAction: "none", outline: sel ? (2 / z) + "px solid " + TEAL : "none", outlineOffset: 3 / z };
      var inner;
      if (it.type === "sticky") {
        inner = e("div", { "data-id": it.id, style: Object.assign(base, { background: it.color, borderRadius: 4, padding: 12, boxShadow: "0 3px 8px rgba(60,40,10,0.18)", overflow: "hidden", display: "flex", flexDirection: "column", gap: 4 }) },
          it.label ? e("div", { style: { font: "700 12px Inter, sans-serif", letterSpacing: 0.5, textTransform: "uppercase", color: "rgba(42,37,32,0.6)" } }, it.label) : null,
          e("div", { style: { font: "600 20px/1.25 " + HAND, color: INK, whiteSpace: "pre-wrap", wordBreak: "break-word", opacity: it.text ? 1 : 0.35 } }, it.text || (it.label ? "Tap twice to write…" : "Tap twice to write")));
      } else if (it.type === "text") {
        inner = e("div", { "data-id": it.id, style: Object.assign(base, { font: "600 " + (it.size || 22) + "px/1.2 " + SERIF, color: it.color, whiteSpace: "pre-wrap", wordBreak: "break-word", opacity: it.text ? 1 : 0.4 }) }, it.text || "Text");
      } else if (it.type === "verse") {
        inner = e("div", { "data-id": it.id, style: Object.assign(base, { background: "#FFFDF8", border: "1px solid #E0D6C5", borderLeft: "6px solid #D9A92C", borderRadius: 10, padding: "10px 12px", boxShadow: "0 2px 6px rgba(60,40,10,0.12)", overflow: "hidden" }) },
          e("div", { style: { font: "700 13px Inter, sans-serif", color: "#8A6A1E", marginBottom: 4 } }, it.ref || "Tap twice to pick a verse"),
          e("div", { style: { font: "15px/1.4 " + SERIF, color: INK } }, it.text),
          it.note ? e("div", { style: { font: "600 17px/1.2 " + HAND, color: TEAL, marginTop: 6 } }, it.note) : null);
      } else if (it.type === "shape") {
        inner = e("div", { "data-id": it.id, style: Object.assign(base, { border: "3px solid " + it.color, background: it.color + "22", borderRadius: it.shape === "circle" ? "50%" : 12, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 10, font: "600 16px/1.25 Inter, sans-serif", color: INK, overflow: "hidden" }) }, it.text);
      } else if (it.type === "stamp") {
        inner = e("div", { "data-id": it.id, style: base }, art(it.icon, it.color, it.w, it.style, hash(it.id)));
      } else return null;
      return e("div", { key: it.id, style: { position: "absolute", left: 0, top: 0 } }, inner,
        sel && it.type !== "ink" ? e("div", { "data-handle": it.id, style: { position: "absolute", left: it.x + it.w - 14 / z, top: it.y + it.h - 14 / z, width: 28 / z, height: 28 / z, borderRadius: "50%", background: TEAL, border: (3 / z) + "px solid #FFF", boxSizing: "border-box", touchAction: "none" } }) : null);
    }
    render() {
      var self = this, S = this.state, b = S.b, cam = this.cam, z = cam.z;
      var byId = {}; b.items.forEach(function (i) { byId[i.id] = i; });
      var inkPath = function (pts) { return pts.map(function (q, i) { return (i ? "L" : "M") + q[0] + " " + q[1]; }).join(""); };
      var svgKids = [e("defs", null, e("marker", { id: "garr", viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: "auto-start-reverse" }, e("path", { d: "M0 0L10 5L0 10z", fill: "#6B6255" })))];
      b.links.forEach(function (l) {
        var A = byId[l.a], B = byId[l.b]; if (!A || !B) return;
        var ra = itemRect(A), rb = itemRect(B), pa = edgePt(ra, rb.x + rb.w / 2, rb.y + rb.h / 2), pb = edgePt(rb, ra.x + ra.w / 2, ra.y + ra.h / 2);
        var mx = (pa[0] + pb[0]) / 2, my = (pa[1] + pb[1]) / 2 - Math.abs(pa[0] - pb[0]) * 0.12;
        svgKids.push(e("path", { key: l.id, "data-link": l.id, d: "M" + pa[0] + " " + pa[1] + "Q" + mx + " " + my + " " + pb[0] + " " + pb[1], fill: "none", stroke: "#6B6255", "stroke-width": 2.5, "stroke-dasharray": "0", "marker-end": "url(#garr)", "stroke-linecap": "round" }));
      });
      var inkKids = [];
      b.items.forEach(function (it) {
        if (it.type !== "ink") return;
        var sel = S.sel === it.id;
        inkKids.push(e("path", { key: it.id + "h", "data-id": it.id, d: inkPath(it.pts), fill: "none", stroke: "transparent", "stroke-width": Math.max(18, it.sw * 4), "stroke-linecap": "round", style: { pointerEvents: S.tool === "pen" ? "none" : "stroke" } }));
        inkKids.push(e("path", { key: it.id, d: inkPath(it.pts), fill: "none", stroke: it.color, "stroke-width": it.sw, "stroke-linecap": "round", "stroke-linejoin": "round", opacity: sel ? 0.6 : 1, style: { pointerEvents: "none" } }));
        if (sel) inkKids.push(e("rect", { key: it.id + "s", x: it.x - 6, y: it.y - 6, width: it.w + 12, height: it.h + 12, fill: "none", stroke: TEAL, "stroke-width": 2 / z, "stroke-dasharray": (6 / z) + " " + (4 / z), style: { pointerEvents: "none" } }));
      });
      if (S.draft) inkKids.push(e("path", { key: "draft", d: inkPath(S.draft), fill: "none", stroke: S.pen, "stroke-width": S.penW, "stroke-linecap": "round", "stroke-linejoin": "round" }));
      var world = e("div", { style: { position: "absolute", left: 0, top: 0, transformOrigin: "0 0", transform: "translate(" + cam.x + "px," + cam.y + "px) scale(" + z + ")" } },
        e("svg", { style: { position: "absolute", left: 0, top: 0, overflow: "visible", width: 1, height: 1, pointerEvents: "none" } }, svgKids),
        b.items.map(function (it) { return self.renderItem(it); }),
        e("svg", { style: { position: "absolute", left: 0, top: 0, overflow: "visible", width: 1, height: 1, pointerEvents: "none" } }, inkKids));
      var gridSize = 32 * z, gx = ((cam.x % gridSize) + gridSize) % gridSize, gy = ((cam.y % gridSize) + gridSize) % gridSize;
      var selIt = S.sel ? byId[S.sel] : null;

      var top = e("div", { style: { height: 48, flex: "none", display: "flex", alignItems: "center", gap: 6, padding: "0 10px", borderBottom: "1px solid " + LINE, background: "#FBF8F2" } },
        e("button", { onClick: this.props.onClose, style: { border: "none", background: "transparent", font: "600 14px Inter", color: TEAL, padding: "8px 4px" } }, "‹ Back"),
        e("div", { onClick: function () { self.setState({ sheet: { kind: "title", text: self.props.title } }); }, style: { flex: 1, minWidth: 0, font: "600 15px " + SERIF, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textAlign: "center" } }, this.props.title),
        e("button", { onClick: function () { self.doUndo(); }, style: { border: "1px solid " + LINE, background: CARD, borderRadius: 10, height: 32, padding: "0 10px", font: "600 12px Inter", opacity: this.undo.length ? 1 : 0.4 } }, "Undo"),
        e("button", { onClick: function () { self.fit(); }, style: { border: "1px solid " + LINE, background: CARD, borderRadius: 10, height: 32, padding: "0 10px", font: "600 12px Inter" } }, "Fit"));

      var canvas = e("div", { ref: this.box, onPointerDown: this.down.bind(this), onPointerMove: this.move.bind(this), onPointerUp: this.up.bind(this), onPointerCancel: this.up.bind(this),
        style: { flex: 1, position: "relative", overflow: "hidden", touchAction: "none", background: PAPER, backgroundImage: "radial-gradient(circle, #D9CFBE 1px, transparent 1.2px)", backgroundSize: gridSize + "px " + gridSize + "px", backgroundPosition: gx + "px " + gy + "px", cursor: S.tool === "pen" ? "crosshair" : "default" } },
        world,
        !b.items.length ? e("div", { style: { position: "absolute", left: 20, right: 20, top: "38%", textAlign: "center", font: "600 22px " + HAND, color: MUTED, pointerEvents: "none" } }, "Pick a tool below and tap anywhere to add it") : null,
        S.linkFrom ? e("div", { style: { position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", background: INK, color: "#FFF", font: "600 12px Inter", padding: "7px 12px", borderRadius: 14, pointerEvents: "none" } }, "Tap another box to connect") : null);

      // selection / tool options bar
      var opt = null;
      if (S.tool === "pen") {
        opt = e("div", { style: barStyle() }, PEN.map(function (c) { return swatch(c, S.pen === c, function () { self.setState({ pen: c }); }); }),
          [2, 4, 9].map(function (w) { return e("button", { key: w, onClick: function () { self.setState({ penW: w }); }, style: { width: 34, height: 34, borderRadius: 10, border: "1px solid " + (S.penW === w ? TEAL : LINE), background: CARD, flex: "none" } }, e("span", { style: { display: "inline-block", width: 18, height: w, borderRadius: w, background: INK } })); }));
      } else if (S.tool === "stamp" && !selIt) {
        opt = e("div", { style: barStyle() }, e("button", { onClick: function () { self.setState({ sheet: { kind: "stamps" } }); }, style: { display: "flex", alignItems: "center", gap: 8, border: "1px solid " + LINE, background: CARD, borderRadius: 12, height: 38, padding: "0 10px", font: "600 12px Inter", flex: "none" } }, art(S.stampIcon, S.stampColor, 26, S.stampStyle, 5), "Change stencil"), e("span", { style: { font: "500 12px Inter", color: MUTED } }, "Tap the board to stamp"));
      } else if (selIt) {
        var acts = [];
        if (selIt.type !== "ink" && selIt.type !== "stamp") acts.push(["Edit", function () { self.edit(selIt); }]);
        if (selIt.type === "verse" && selIt.ref) acts.push(["Read", function () { self.props.openRef(firstRef(selIt.ref)); }]);
        acts.push(["Connect", function () { self.setState({ linkFrom: selIt.id }); }]);
        if (selIt.type === "shape") acts.push([selIt.shape === "circle" ? "Box" : "Circle", function () { self.patch(selIt.id, { shape: selIt.shape === "circle" ? "rect" : "circle" }); }]);
        if (selIt.type === "stamp") acts.push(["Style", function () { var st = ["graffiti", "stencil", "sketch", "cartoon"]; self.patch(selIt.id, { style: st[(st.indexOf(selIt.style) + 1) % 4] }); }]);
        acts.push(["Copy", function () { self.dup(selIt.id); }], ["Front", function () { self.front(selIt.id); }]);
        var cols = selIt.type === "sticky" ? STICKY : PEN;
        opt = e("div", { style: barStyle() },
          acts.map(function (a) { return e("button", { key: a[0], onClick: a[1], style: { height: 34, padding: "0 10px", borderRadius: 10, border: "1px solid " + LINE, background: CARD, font: "600 12px Inter", flex: "none" } }, a[0]); }),
          selIt.type !== "verse" ? cols.map(function (c) { return swatch(c, selIt.color === c, function () { self.patch(selIt.id, { color: c }); }); }) : null,
          e("button", { onClick: function () { self.del(selIt.id); }, style: { height: 34, padding: "0 10px", borderRadius: 10, border: "none", background: "#F3D9DF", color: "#8A2943", font: "600 12px Inter", flex: "none" } }, "Delete"));
      }
      // remove link: tapping isn't possible on svg (pointer-events none); offer in selection of item via list
      var linksOfSel = selIt ? b.links.filter(function (l) { return l.a === selIt.id || l.b === selIt.id; }) : [];
      if (selIt && linksOfSel.length) opt = e("div", null, opt, e("div", { style: barStyle() }, e("span", { style: { font: "600 11px Inter", color: MUTED, flex: "none" } }, "Lines:"), linksOfSel.map(function (l) {
        var other = byId[l.a === selIt.id ? l.b : l.a]; var nm = other ? (other.label || other.ref || other.text || other.icon || other.type).slice(0, 14) : "?";
        return e("button", { key: l.id, onClick: function () { self.commit(Object.assign({}, b, { links: b.links.filter(function (x) { return x.id !== l.id; }) })); }, style: { height: 30, padding: "0 9px", borderRadius: 15, border: "1px solid " + LINE, background: CARD, font: "600 11px Inter", flex: "none" } }, "✕ " + nm);
      })));

      var tools = e("div", { style: { flex: "none", display: "grid", gridTemplateColumns: "repeat(8, minmax(0,1fr))", borderTop: "1px solid " + LINE, background: "#FBF8F2", height: 56 } }, TOOLS.map(function (t) {
        var on = S.tool === t[0];
        return e("button", { key: t[0], onClick: function () { if (t[0] === "stamp" && S.tool !== "stamp") self.setState({ sheet: { kind: "stamps" } }); self.setState({ tool: t[0], sel: null, linkFrom: null }); }, style: { border: "none", background: "transparent", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, color: on ? TEAL : "#4A4236", font: "600 9.5px Inter", padding: 0 } },
          e("span", { style: { width: 36, height: 26, borderRadius: 13, background: on ? "#E3EEEC" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" } }, e("svg", { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": 1.8, "stroke-linecap": "round", "stroke-linejoin": "round" }, e("path", { d: t[2] }))), t[1]);
      }));

      return e("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: PAPER, zIndex: 5 } }, top, canvas, opt, tools, this.renderSheet());
    }
    renderSheet() {
      var S = this.state, sh = S.sheet, self = this; if (!sh) return null;
      var close = function () { self.setState({ sheet: null }); };
      var body;
      if (sh.kind === "stamps") {
        var styles = [["graffiti", "Graffiti"], ["stencil", "Stencil"], ["sketch", "Sketch"], ["cartoon", "Cartoon"]];
        var colors = ["#B44664", "#B9822A", "#2E8A6C", "#3A6E9C", "#8E4FA3", "#C0603A", "#D9A92C", "#2A2520"];
        body = [e("div", { key: "st", style: { display: "flex", gap: 6, overflowX: "auto", paddingBottom: 6 } }, styles.map(function (s) { return chip(s[1], S.stampStyle === s[0], function () { self.setState({ stampStyle: s[0] }); }); })),
          e("div", { key: "co", style: { display: "flex", gap: 6, margin: "8px 0" } }, colors.map(function (c) { return swatch(c, S.stampColor === c, function () { self.setState({ stampColor: c }); }); })),
          e("div", { key: "ic", style: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, maxHeight: 300, overflowY: "auto" } }, IC_NAMES.map(function (n) {
            return e("button", { key: n, onClick: function () { self.setState({ stampIcon: n, sheet: null, tool: "stamp" }); }, style: { border: "1px solid " + (S.stampIcon === n ? TEAL : LINE), background: CARD, borderRadius: 12, padding: 6, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, font: "500 10px Inter", color: MUTED } }, art(n, S.stampColor, 44, S.stampStyle, 9), n);
          }))];
        return sheetWrap("Stencils", body, close);
      }
      if (sh.kind === "title") {
        return sheetWrap("Rename topic", [e("input", { key: "t", value: sh.text, onInput: function (ev) { self.setState({ sheet: Object.assign({}, sh, { text: ev.target.value }) }); }, style: inputStyle() }),
          e("div", { key: "b", style: { display: "flex", gap: 8, marginTop: 10 } }, btn("Save", function () { self.props.onRename && self.props.onRename(sh.text.trim() || self.props.title); close(); }, { flex: 1 }))], close);
      }
      var it = this.find(sh.id); if (!it) return null;
      var set = function (k) { return function (ev) { var o = {}; o[k] = ev.target.value; self.setState({ sheet: Object.assign({}, sh, o) }); }; };
      var save = function () {
        var ch = { text: sh.text, label: sh.label };
        if (it.type === "verse") { ch = { ref: sh.ref.trim(), note: sh.note, text: vtext(self.props.getVerse, sh.ref.trim()) || sh.text }; }
        self.patch(it.id, ch); close();
      };
      if (it.type === "verse") {
        var preview = vtext(this.props.getVerse, sh.ref);
        body = [e("input", { key: "r", ref: foc, value: sh.ref, placeholder: "e.g. John 10:27 or Romans 8:38-39", onInput: set("ref"), style: inputStyle() }),
          e("div", { key: "p", style: { font: "15px/1.45 " + SERIF, color: preview ? INK : MUTED, margin: "10px 2px", maxHeight: 150, overflowY: "auto" } }, preview || "Type a reference to see the verse (KJV)."),
          e("textarea", { key: "n", value: sh.note, placeholder: "Your note (optional)", onInput: set("note"), style: Object.assign(inputStyle(), { height: 70, paddingTop: 10, font: "600 18px " + HAND }) })];
      } else {
        body = [it.type === "sticky" ? e("input", { key: "l", value: sh.label, placeholder: "Heading (optional)", onInput: set("label"), style: Object.assign(inputStyle(), { marginBottom: 8 }) }) : null,
          e("textarea", { key: "t", ref: foc, value: sh.text, placeholder: "Write here…", onInput: set("text"), style: Object.assign(inputStyle(), { height: 140, paddingTop: 10 }) })];
      }
      body.push(e("div", { key: "bb", style: { display: "flex", gap: 8, marginTop: 10 } }, btn("Done", save, { flex: 1 })));
      return sheetWrap(it.type === "verse" ? "Verse card" : "Write", body, function () { save(); });
    }
  }
  function swatch(c, on, onClick) { return e("button", { key: c, onClick: onClick, "aria-label": "colour", style: { width: 30, height: 30, borderRadius: "50%", background: c, border: on ? "3px solid " + INK : "1px solid rgba(0,0,0,0.15)", flex: "none", padding: 0 } }); }
  function barStyle() { return { flex: "none", display: "flex", alignItems: "center", gap: 6, padding: "8px 10px", overflowX: "auto", background: "#FBF8F2", borderTop: "1px solid " + LINE }; }
  function foc(el) { if (el && !el._f) { el._f = 1; setTimeout(function () { try { el.focus(); } catch (x) {} }, 60); } }
  function inputStyle() { return { width: "100%", boxSizing: "border-box", height: 46, border: "1px solid #E0D6C5", borderRadius: 12, padding: "0 12px", background: "#FFFDF8", font: "500 16px Inter, sans-serif", color: INK, outline: "none", resize: "none" }; }
  function sheetWrap(title, body, onClose) {
    return e("div", { style: { position: "absolute", inset: 0, zIndex: 20, display: "flex", flexDirection: "column", justifyContent: "flex-end" } },
      e("div", { onClick: onClose, style: { flex: 1, background: "rgba(42,37,32,0.32)" } }),
      e("div", { style: { background: "#FBF8F2", borderRadius: "20px 20px 0 0", padding: "10px 16px 18px", maxHeight: "82%", overflowY: "auto", boxShadow: "0 -6px 20px rgba(0,0,0,0.12)" } },
        e("div", { style: { width: 40, height: 4, borderRadius: 2, background: "#D9CFBE", margin: "0 auto 10px" } }),
        e("div", { style: { display: "flex", alignItems: "center", marginBottom: 10 } }, e("div", { style: { flex: 1, font: "600 18px " + SERIF } }, title), e("button", { onClick: onClose, style: { border: "none", background: "transparent", font: "600 22px Inter", color: MUTED, padding: "0 4px" } }, "×")),
        body));
  }
  DC.register("GrowBoard", Board);

  /* ---------- starter boards ---------- */
  var CHAIN = ["They say…", "The Bible says", "Context", "Original word", "So what?", "Memorise"];
  var CHAIN_C = ["#F6B5C0", "#F7DC6F", "#A8D8DC", "#D9C8F2", "#FFD3A6", "#BFE3AE"];
  function starterBoard(title, refs, getVerse, icon) {
    var items = [], links = [];
    items.push({ id: uid("n"), type: "stamp", icon: icon || "bulb", color: "#B44664", style: "graffiti", x: 0, y: 0, w: 120, h: 120 });
    items.push({ id: uid("n"), type: "text", text: title, color: INK, size: 30, x: 140, y: 20, w: 520, h: 90 });
    var chainIds = [];
    CHAIN.forEach(function (c, i) { var id = uid("n"); chainIds.push(id); items.push({ id: id, type: "sticky", label: c, text: "", color: CHAIN_C[i], x: 760, y: i * 170, w: 230, h: 140 }); if (i) links.push({ id: uid("l"), a: chainIds[i - 1], b: id }); });
    (refs || []).forEach(function (r, i) { items.push({ id: uid("n"), type: "verse", ref: r, text: vtext(getVerse, r), x: (i % 2) * 300, y: 170 + Math.floor(i / 2) * 200, w: 270, h: 175 }); });
    items.push({ id: uid("n"), type: "text", text: "Starter verses: delete anything you don't need", color: MUTED, size: 18, x: 0, y: 140, w: 560, h: 30 });
    return { items: items, links: links };
  }
  var STARTERS = {
    trinity: { t: "How do we describe the Trinity, and what does the Bible say?", ic: "globe", r: ["Deuteronomy 6:4", "Matthew 28:19", "Matthew 3:16-17", "John 1:1", "Acts 5:3-4", "2 Corinthians 13:14"] },
    trust: { t: "How do we know we can trust the Bible?", ic: "scroll", r: ["2 Timothy 3:16-17", "2 Peter 1:20-21", "Luke 1:1-4", "1 John 1:1-3", "Matthew 5:18", "Isaiah 40:8"] },
    heaven: { t: "What does the Bible say about heaven?", ic: "sun", r: ["John 14:2-3", "2 Corinthians 5:8", "Philippians 3:20-21", "1 Corinthians 15:42-44", "Revelation 21:1-4", "Revelation 22:3-5"] }
  };
  // Suggestions she can add with one tap (titles reframed to her wording)
  var SUGGEST = [
    ["How do we prove Jesus is God?", "th-jesus"], ["What is the Holy Spirit? Same gifts for everyone, for life?", "spirit"], ["How do we hear God's voice?", "voice"],
    ["Does prayer change things?", "prayer"], ["Why does God allow suffering? (free will)", "suffering"], ["Can you lose your salvation?", "secure"],
    ["Tithing: is 10% commanded for Christians?", "money"], ["Prophecies: how many, fulfilled, still to come", "prophecy"], ["Genesis 1–11: what the text actually says", "creation"],
    ["Angels, demons & spiritual warfare", "warfare"], ["End times & Revelation", "endtimes"], ["What is a follower of Christ?", "identity"],
    ["Which Old Testament laws still apply?", "law"], ["Defending the faith today", "apologetics"], ["How did the Bible come together?", "canon"], ["Death: what happens when we die?", "death"],
    ["Temptation", "temptation"], ["Why are we called to forgive?", "forgive"], ["Anxiety & worry", "anxiety"], ["Faith vs works: how to explain it", "faithworks"],
    ["Marriage, singleness & relationships", "relationships"], ["Did Jesus really rise from the dead?", "resurrection"], ["How do I study the Bible well?", "study"], ["Hell (last topic)", "hell"]
  ];
  var TOPIC_BY = {}; G.TOPICS.forEach(function (t) { TOPIC_BY[t.id] = t; });
  function refsOf(tid) { var t = TOPIC_BY[tid]; if (!t) return []; var out = []; t.b.forEach(function (b) { if (b[1]) out.push(b[1].split(";")[0].trim()); }); return out.slice(0, 6); }

  /* =====================================================================
     GrowTab
     ===================================================================== */
  class GrowTab extends P.Component {
    constructor(p) { super(p); this.state = { sec: "plan", bsub: "books", sheet: null, board: null, role: "All", vmode: 0, deck: null, reveal: false, quiz: null, showPath: false, newTopic: null, showSug: false }; }
    g() {
      var g = this.props.grow || {};
      return Object.assign({ start: today(), boards: {}, topics: null, verses: null, ticks: {}, path: {}, known: {}, checks: {}, notes: {}, best: 0 }, g);
    }
    upd(fn) { var g = clone(this.g()); fn(g); this.props.onGrow(g); }
    componentDidMount() {
      var self = this, g = this.g();
      if (!g.topics || !g.verses) this.upd(function (x) {
        if (!x.topics) x.topics = ["trinity", "trust", "heaven"].map(function (k) { return { id: k, t: STARTERS[k].t, ic: STARTERS[k].ic, made: today() }; });
        if (!x.verses) { x.verses = {}; G.VERSES.slice(0, 5).forEach(function (v) { x.verses[v[0]] = { box: 0, due: today() }; }); }
      });
    }
    open(sheet) { this.setState({ sheet: sheet }); }

    /* ----- PLAN ----- */
    renderPlan(g) {
      var self = this, td = today(), tk = g.ticks[td] || {};
      var week = Math.floor(daysBetween(g.start, td) / 7) + 1;
      var rm = G.ROADMAP[Math.min(week, 5) - 1];
      var nextPath = G.PATH.findIndex(function (_, i) { return !g.path[i]; }); if (nextPath < 0) nextPath = 0;
      var due = Object.keys(g.verses || {}).filter(function (r) { return g.verses[r].due <= td; }).length;
      var mastered = Object.keys(g.verses || {}).filter(function (r) { return g.verses[r].box >= 4; }).length;
      var streak = 0; for (var i = 0; i < 400; i++) { var t = g.ticks[today(-i)]; if (t && (t.read || t.review || t.learn)) streak++; else if (i > 0) break; }
      var setTick = function (k) { self.upd(function (x) { x.ticks[td] = Object.assign({}, x.ticks[td] || {}); x.ticks[td][k] = !x.ticks[td][k]; }); };
      var row = function (k, ic, color, title, sub, go, goLabel) {
        return e("div", { style: { display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderTop: k === "read" ? "none" : "1px solid #F0E9DD" } },
          tick(tk[k], function () { setTick(k); }), art(ic, color, 40, "graffiti"),
          e("div", { style: { flex: 1, minWidth: 0 } }, e("div", { style: { font: "600 14px Inter" } }, title), e("div", { style: { font: "500 12px/1.35 Inter", color: MUTED } }, sub)),
          btn(goLabel, go, { h: 34, ghost: true }));
      };
      var learnGo = rm ? function () { self.setState({ sec: rm.go[0], bsub: rm.go[1] }); } : function () { self.setState({ sec: "topics" }); };
      return [
        e("div", { key: "hero", style: { display: "flex", gap: 12, alignItems: "center", background: "#1F5E5B", color: "#F7F3EC", borderRadius: 18, padding: 16, marginTop: 12 } },
          art(rm ? rm.ic : "seed", "#D9A92C", 64, "graffiti"),
          e("div", { style: { flex: 1 } }, e("div", { style: { font: "600 12px Inter", opacity: 0.8 } }, "Week " + week + (streak ? " · " + streak + "-day streak" : "")),
            e("div", { style: { font: "600 19px/1.2 " + SERIF, marginTop: 2 } }, rm ? rm.t : "Deep-dive a topic"),
            e("div", { style: { font: "500 12px/1.35 Inter", opacity: 0.85, marginTop: 4 } }, rm ? rm.d : "Pick one of your topics and map it out this week."))),
        h2("Today · about 25 minutes", "Tick each one off as you go"),
        card([row("read", "book", "#B9822A", "Read · 12 min", G.PATH[nextPath][0] + " (chronological plan)", function () { self.props.openRef(G.PATH[nextPath][1]); }, "Read"),
          row("review", "heart", "#B44664", "Verses · 5 min", due ? due + " verse" + (due > 1 ? "s" : "") + " to review" : "All caught up. Add a new verse", function () { self.setState({ sec: "verses", deck: null }); }, "Review"),
          row("learn", rm ? rm.ic : "bulb", "#2E8A6C", "Learn · 8 min", rm ? rm.t : "Work on a topic board", learnGo, "Go")], { style: { padding: "4px 14px" } }),
        h2("Progress"),
        card(e("div", { style: { display: "flex" } }, ring(Object.keys(g.path).filter(function (k) { return g.path[k]; }).length, G.PATH.length, "Reading", "#B9822A"),
          ring(Object.keys(g.known).filter(function (k) { return g.known[k]; }).length, 66, "Books known", "#3A6E9C"), ring(mastered, G.VERSES.length, "Verses learnt", "#B44664"), ring((g.topics || []).length, 30, "Topics", "#2E8A6C"))),
        h2("Starter roadmap", "Four weeks to get the big picture"),
        e("div", { key: "rm", style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 } }, G.ROADMAP.map(function (r) {
          var on = week === r.w;
          return card([e("div", { key: "a", style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" } }, art(r.ic, on ? "#D9A92C" : "#C9BBA5", 46, on ? "graffiti" : "sketch"), e("span", { style: { font: "700 11px Inter", color: on ? TEAL : MUTED } }, "WEEK " + r.w)),
            e("div", { key: "b", style: { font: "600 14px " + SERIF, marginTop: 6 } }, r.t)], { onClick: function () { self.setState({ sec: r.go[0], bsub: r.go[1] }); }, style: { padding: 12, border: "1px solid " + (on ? TEAL : LINE) } });
        })),
        h2("Chronological reading path", G.PATH.length + " blocks · about a year at 12 min a day"),
        card(G.PATH.slice(0, this.state.showPath ? G.PATH.length : Math.min(G.PATH.length, nextPath + 4)).map(function (p, i) {
          if (!self.state.showPath && i < nextPath - 2) return null;
          return e("div", { key: i, style: { display: "flex", alignItems: "center", gap: 10, padding: "7px 0" } }, tick(g.path[i], function () { self.upd(function (x) { x.path[i] = !x.path[i]; }); }, "#B9822A"),
            e("div", { style: { flex: 1, font: (i === nextPath ? "700 " : "500 ") + "13px Inter", color: g.path[i] ? MUTED : INK } }, (i + 1) + ". " + p[0]),
            e("button", { onClick: function () { self.props.openRef(p[1]); }, style: { border: "none", background: "transparent", color: TEAL, font: "600 12px Inter" } }, "Open"));
        }).concat([e("button", { key: "more", onClick: function () { self.setState({ showPath: !self.state.showPath }); }, style: { border: "none", background: "transparent", color: TEAL, font: "600 13px Inter", padding: "8px 0" } }, this.state.showPath ? "Show less" : "Show the whole path")]), { style: { padding: "6px 14px" } }),
        h2("I can…", "Your Bible basics checklist"),
        card(G.CHECKS.map(function (c) { return e("div", { key: c[0], style: { display: "flex", alignItems: "center", gap: 10, padding: "7px 0" } }, tick(g.checks[c[0]], function () { self.upd(function (x) { x.checks[c[0]] = !x.checks[c[0]]; }); }, "#2E8A6C"), e("div", { style: { font: "500 13px/1.35 Inter" } }, c[1])); }), { style: { padding: "6px 14px", marginBottom: 20 } })
      ];
    }

    /* ----- BASICS ----- */
    renderBasics(g) {
      var self = this, sub = this.state.bsub;
      var subs = [["books", "66 Books"], ["story", "Story"], ["people", "People"], ["prophets", "Prophets"], ["covenants", "Covenants"]];
      var out = [e("div", { key: "subs", style: { display: "flex", gap: 6, overflowX: "auto", padding: "12px 0 4px" } }, subs.map(function (s) { return chip(s[1], sub === s[0], function () { self.setState({ bsub: s[0] }); }); }))];
      if (sub === "books") {
        // shelf: spines sized by chapters
        ["OT", "NT"].forEach(function (tt) {
          var bs = G.BOOKS.filter(function (b) { return SEC[b[1]].t === tt; }), tot = bs.reduce(function (s, b) { return s + 1; }, 0);
          out.push(e("div", { key: "shelf" + tt, style: { margin: "10px 0 2px" } }, e("div", { style: { font: "700 11px Inter", color: MUTED, marginBottom: 4 } }, tt === "OT" ? "OLD TESTAMENT · 39 books" : "NEW TESTAMENT · 27 books"),
            e("div", { style: { display: "flex", height: 54, alignItems: "flex-end", gap: 1, borderBottom: "4px solid #8A6A1E", paddingBottom: 1 } }, bs.map(function (b) {
              var i = BOOKI[b[0]], hgt = 30 + Math.min(22, Math.sqrt(window.GROW_CH[i]) * 2.4);
              return e("div", { key: b[0], onClick: function () { self.open({ kind: "book", i: i }); }, title: b[0], style: { flex: 1, height: hgt, background: SEC[b[1]].c, borderRadius: "2px 2px 0 0", opacity: g.known[b[0]] ? 1 : 0.55, boxShadow: "inset -1px 0 rgba(0,0,0,0.2)" } });
            }))));
        });
        out.push(e("div", { key: "tip", style: { font: "500 12px Inter", color: MUTED, margin: "6px 2px 0" } }, "Each spine is a book (taller = more chapters). Bright = you know it."));
        G.SECTIONS.forEach(function (s) {
          var bs = G.BOOKS.filter(function (b) { return b[1] === s.id; });
          out.push(e("div", { key: s.id, style: { marginTop: 14 } },
            e("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 6 } }, e("span", { style: { width: 12, height: 12, borderRadius: 4, background: s.c } }), e("span", { style: { font: "600 15px " + SERIF } }, s.name), e("span", { style: { font: "500 12px Inter", color: MUTED } }, bs.length + " books")),
            e("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 } }, bs.map(function (b) {
              var i = BOOKI[b[0]], kn = g.known[b[0]];
              return e("button", { key: b[0], onClick: function () { self.open({ kind: "book", i: i }); }, style: { border: "1px solid " + (kn ? s.c : LINE), background: kn ? s.c + "1F" : CARD, borderRadius: 12, padding: "8px 4px 6px", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, minHeight: 74 } },
                art(b[5], s.c, 34, kn ? "graffiti" : "stencil", hash(b[0])), e("span", { style: { font: "600 10.5px/1.15 Inter", color: INK, textAlign: "center" } }, b[0]));
            }))));
        });
        out.push(e("div", { key: "q", style: { margin: "16px 0 24px" } }, btn("Quiz me on the books", function () { self.startQuiz("books"); }, { style: { width: "100%" } })));
      }
      if (sub === "story") {
        out.push(e("div", { key: "intro", style: { font: "500 13px/1.45 Inter", color: MUTED, margin: "8px 2px 4px" } }, "The whole Bible in 12 eras. Learn the order, then retell it from memory."));
        G.ERAS.forEach(function (er, i) {
          out.push(e("div", { key: i, style: { display: "flex", gap: 10 } },
            e("div", { style: { width: 26, display: "flex", flexDirection: "column", alignItems: "center", flex: "none" } }, e("div", { style: { width: 26, height: 26, borderRadius: "50%", background: er.c, color: "#FFF", font: "700 12px Inter", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 14 } }, i + 1), i < 11 ? e("div", { style: { flex: 1, width: 3, background: er.c, opacity: 0.35 } }) : null),
            card([e("div", { key: "t", style: { display: "flex", gap: 10, alignItems: "center" } }, duo(er.ic, er.c, 66, hash(er.n)),
              e("div", { style: { flex: 1 } }, e("div", { style: { font: "600 16px " + SERIF } }, er.n), e("div", { style: { font: "600 12px Inter", color: er.c } }, er.y))),
              e("div", { key: "s", style: { font: "500 13px/1.45 Inter", marginTop: 8 } }, er.s),
              er.who.length ? e("div", { key: "w", style: { display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 } }, er.who.map(function (w) { return e("span", { key: w, style: { font: "600 11px Inter", background: er.c + "22", color: INK, padding: "3px 8px", borderRadius: 10 } }, w); })) : null,
              e("div", { key: "b", style: { font: "500 12px Inter", color: MUTED, marginTop: 8 } }, "📖 " + er.books)],
              { onClick: function () { self.open({ kind: "era", i: i }); }, style: { flex: 1, margin: "8px 0", borderLeft: "5px solid " + er.c } })));
        });
        out.push(e("div", { key: "q", style: { margin: "10px 0 24px" } }, btn("Quiz me on the story", function () { self.startQuiz("story"); }, { style: { width: "100%" } })));
      }
      if (sub === "people") {
        var roles = ["All", "Patriarch", "Judge", "King", "Prophet", "Priest", "Apostle", "Writer"], role = this.state.role;
        out.push(e("div", { key: "roles", style: { display: "flex", gap: 6, overflowX: "auto", padding: "8px 0" } }, roles.map(function (r) { return chip(r, role === r, function () { self.setState({ role: r }); }, G.ROLE_C[r]); })));
        var ps = G.PEOPLE.filter(function (p) { return role === "All" || p[1].indexOf(role) >= 0 || (role === "King" && p[1].indexOf("Queen") >= 0); });
        out.push(e("div", { key: "grid", style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, paddingBottom: 24 } }, ps.map(function (p) {
          var c = G.ROLE_C[p[1][0]] || "#8A7F70", er = G.ERAS[p[2]];
          return card([e("div", { key: "a", style: { display: "flex", gap: 8, alignItems: "center" } }, art(p[5], c, 44, "graffiti", hash(p[0])), e("div", { style: { flex: 1, minWidth: 0, font: "600 14px/1.2 " + SERIF } }, p[0])),
            e("div", { key: "r", style: { display: "flex", flexWrap: "wrap", gap: 3, marginTop: 6 } }, p[1].map(function (r) { return e("span", { key: r, style: { font: "700 9.5px Inter", letterSpacing: 0.3, color: "#FFF", background: G.ROLE_C[r] || "#8A7F70", padding: "2px 6px", borderRadius: 6, textTransform: "uppercase" } }, r); })),
            e("div", { key: "e", style: { font: "500 11px Inter", color: er.c, marginTop: 5 } }, er.n)], { onClick: function () { self.open({ kind: "person", i: G.PEOPLE.indexOf(p) }); }, style: { padding: 10 } });
        })));
      }
      if (sub === "prophets") {
        var cols = [["before", "Before the exile", "Warning Israel & Judah"], ["during", "During the exile", "In Babylon / the fall"], ["after", "After the exile", "Back home rebuilding"]];
        out.push(e("div", { key: "intro", style: { font: "500 13px/1.45 Inter", color: MUTED, margin: "8px 2px" } }, "The 17 prophetic books placed in time. Colour = who they spoke to."));
        out.push(e("div", { key: "cols", style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 } }, cols.map(function (c, ci) {
          var names = Object.keys(G.PROPHET_TIME).filter(function (n) { return G.PROPHET_TIME[n][0] === c[0]; });
          return e("div", { key: c[0], style: { background: ["#F3E7D3", "#EBE2F0", "#E2EEE9"][ci], borderRadius: 14, padding: 8, display: "flex", flexDirection: "column", gap: 5 } },
            art(["crown", "ziggurat", "temple"][ci], ["#B44664", "#6B4E8A", "#C9822B"][ci], 40, "graffiti", ci + 3),
            e("div", { style: { font: "700 12px/1.2 Inter" } }, c[1]), e("div", { style: { font: "500 10.5px/1.25 Inter", color: MUTED, marginBottom: 2 } }, c[2]),
            names.map(function (n) { var pt = G.PROPHET_TIME[n]; return e("button", { key: n, onClick: function () { self.open({ kind: "book", i: BOOKI[n] }); }, style: { border: "none", borderRadius: 9, background: G.AUD_C[pt[1]], color: "#FFF", font: "600 11.5px Inter", padding: "7px 4px", textAlign: "center" } }, n + (pt[2] ? " *" : "")); }));
        })));
        out.push(e("div", { key: "leg", style: { display: "flex", flexWrap: "wrap", gap: 8, margin: "12px 2px" } }, ["Israel (north)", "Judah (south)", "Nations (Nineveh)", "Exiles in Babylon", "Returned exiles"].map(function (a) { return e("span", { key: a, style: { display: "flex", alignItems: "center", gap: 5, font: "500 11.5px Inter" } }, e("span", { style: { width: 11, height: 11, borderRadius: 3, background: G.AUD_C[a] } }), a.replace(" (Nineveh)", " (Nineveh, Edom)")); })));
        out.push(e("div", { key: "note", style: { font: "500 11.5px/1.4 Inter", color: MUTED, margin: "0 2px 6px" } }, "* Joel and Obadiah's dates are debated. Israel (north) fell to Assyria in 722 BC; Judah fell to Babylon in 586 BC; the return began in 538 BC."));
        out.push(e("div", { key: "q", style: { margin: "10px 0 24px" } }, btn("Quiz me on the prophets", function () { self.startQuiz("prophets"); }, { style: { width: "100%" } })));
      }
      if (sub === "covenants") {
        out.push(e("div", { key: "intro", style: { font: "500 13px/1.45 Inter", color: MUTED, margin: "8px 2px" } }, "Five big promises that hold the story together, each pointing to Jesus."));
        G.COVENANTS.forEach(function (c, i) {
          out.push(e("div", { key: i }, card([e("div", { key: "a", style: { display: "flex", gap: 12, alignItems: "center" } }, art(c.ic, c.c, 60, "graffiti", i + 11),
            e("div", { style: { flex: 1 } }, e("div", { style: { font: "600 16px " + SERIF } }, c.n), e("div", { style: { font: "600 11.5px Inter", color: c.c } }, "Sign: " + c.sign), e("div", { style: { font: "500 13px/1.4 Inter", marginTop: 4 } }, c.p)))],
            { onClick: function () { self.open({ kind: "cov", i: i }); } }), i < 4 ? e("div", { style: { height: 18, width: 3, background: "#D9CFBE", margin: "0 auto" } }) : null));
        });
        out.push(e("div", { key: "pad", style: { height: 24 } }));
      }
      return out;
    }

    /* ----- VERSES (flashcards + spaced review) ----- */
    renderVerses(g) {
      var self = this, td = today(), V = g.verses || {}, gv = this.props.getVerse;
      var modes = ["Verse → where?", "Where → verse", "They say → ?"], mode = this.state.vmode;
      var due = G.VERSES.filter(function (v) { return V[v[0]] && V[v[0]].due <= td; });
      var out = [e("div", { key: "m", style: { display: "flex", gap: 6, overflowX: "auto", padding: "12px 0 6px" } }, modes.map(function (m, i) { return chip(m, mode === i, function () { self.setState({ vmode: i, reveal: false }); }); }))];
      var cur = this.state.deck != null ? G.VERSES[this.state.deck] : due[0];
      if (cur && V[cur[0]] && V[cur[0]].due <= td) {
        var txt = vtext(gv, cur[0]), rev = this.state.reveal, hookC = "#B44664";
        var front, back;
        if (mode === 0) { front = e("div", { style: { font: "17px/1.5 " + SERIF } }, "“" + txt + "”"); back = [e("div", { key: "r", style: { font: "700 22px " + SERIF, color: TEAL } }, cur[0]), e("div", { key: "t", style: { font: "600 13px Inter", color: MUTED } }, cur[1])]; }
        else if (mode === 1) { front = [e("div", { key: "r", style: { font: "700 24px " + SERIF } }, cur[0]), e("div", { key: "t", style: { font: "600 13px Inter", color: MUTED, marginTop: 4 } }, cur[1])]; back = e("div", { style: { font: "17px/1.5 " + SERIF } }, "“" + txt + "”"); }
        else { front = [e("div", { key: "a", style: { font: "600 12px Inter", color: MUTED } }, "Someone says:"), e("div", { key: "b", style: { font: "600 24px/1.2 " + HAND, marginTop: 4 } }, "“" + cur[2] + "”")]; back = [e("div", { key: "r", style: { font: "700 20px " + SERIF, color: TEAL } }, cur[0]), e("div", { key: "t", style: { font: "16px/1.45 " + SERIF, marginTop: 6 } }, txt)]; }
        var rate = function (q) { self.upd(function (x) { var s = x.verses[cur[0]] || { box: 0 }; s.box = q === 0 ? 0 : q === 1 ? Math.max(1, s.box) : Math.min(6, s.box + 1); s.due = today(q === 0 ? 0 : BOX_DAYS[s.box]); s.seen = (s.seen || 0) + 1; x.verses[cur[0]] = s; x.ticks[td] = Object.assign({}, x.ticks[td] || {}, { review: true }); }); self.setState({ reveal: false, deck: null }); };
        out.push(e("div", { key: "fc", onClick: function () { if (!rev) self.setState({ reveal: true }); }, style: { background: CARD, border: "1px solid " + LINE, borderRadius: 22, padding: 18, minHeight: 280, display: "flex", flexDirection: "column", gap: 12, boxShadow: "0 6px 18px rgba(60,40,10,0.08)" } },
          e("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, e("span", { style: { font: "700 11px Inter", color: MUTED } }, due.length + " DUE · BOX " + (V[cur[0]].box || 0) + "/6"), art(cur[3], hookC, 56, ["graffiti", "cartoon", "stencil"][hash(cur[0]) % 3], hash(cur[0]))),
          e("div", null, front),
          rev ? e("div", { style: { borderTop: "2px dashed " + LINE, paddingTop: 12 } }, back) : e("div", { style: { marginTop: "auto", font: "600 18px " + HAND, color: MUTED, textAlign: "center" } }, "Say it out loud, then tap to check")));
        if (rev) out.push(e("div", { key: "rate", style: { display: "flex", gap: 8, marginTop: 10 } }, btn("Again", function () { rate(0); }, { bg: "#B44664", flex: 1, h: 46 }), btn("Hard", function () { rate(1); }, { bg: "#C9822B", flex: 1, h: 46 }), btn("Got it", function () { rate(2); }, { bg: "#2E8A6C", flex: 1, h: 46 })));
        out.push(e("div", { key: "rd", style: { textAlign: "center", marginTop: 8 } }, e("button", { onClick: function () { self.props.openRef(firstRef(cur[0])); }, style: { border: "none", background: "transparent", color: TEAL, font: "600 13px Inter" } }, "Read it in context →")));
      } else {
        out.push(card([e("div", { key: "a", style: { display: "flex", gap: 12, alignItems: "center" } }, art("heart", "#2E8A6C", 54), e("div", null, e("div", { style: { font: "600 16px " + SERIF } }, "All caught up"), e("div", { style: { font: "500 12.5px/1.4 Inter", color: MUTED } }, "Add a new verse below. Reviews come back after 1, 2, 4, 8, 16 then 32 days.")))]));
      }
      out.push(h2("Anchor verses", "Learning " + Object.keys(V).length + " of " + G.VERSES.length + " · the dots show how well you know each one"));
      out.push(e("div", { key: "list", style: { display: "flex", flexDirection: "column", gap: 6, paddingBottom: 24 } }, G.VERSES.map(function (v, i) {
        var s = V[v[0]];
        return e("div", { key: v[0], style: { display: "flex", alignItems: "center", gap: 10, background: CARD, border: "1px solid " + LINE, borderRadius: 14, padding: "8px 10px" } },
          art(v[3], s ? "#B44664" : "#CFC4B2", 36, s ? "graffiti" : "sketch", hash(v[0])),
          e("div", { onClick: function () { self.open({ kind: "verse", i: i }); }, style: { flex: 1, minWidth: 0 } }, e("div", { style: { font: "700 13px Inter" } }, v[0]), e("div", { style: { font: "500 11.5px Inter", color: MUTED, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, v[1])),
          s ? e("div", { style: { display: "flex", gap: 2 } }, [1, 2, 3, 4, 5, 6].map(function (k) { return e("span", { key: k, style: { width: 6, height: 6, borderRadius: 3, background: s.box >= k ? "#2E8A6C" : "#E6DED1" } }); }))
            : e("button", { onClick: function () { self.upd(function (x) { x.verses[v[0]] = { box: 0, due: today() }; }); }, style: { border: "1px solid " + TEAL, background: "transparent", color: TEAL, borderRadius: 10, height: 30, padding: "0 10px", font: "600 12px Inter" } }, "+ Learn"));
      })));
      return out;
    }

    /* ----- QUIZ ----- */
    makeQuiz(kind) {
      var qs = [], gv = this.props.getVerse, secNames = G.SECTIONS.map(function (s) { return s.name; });
      function q(prompt, right, wrongs, info) { var opts = shuffle([right].concat(shuffle(wrongs.filter(function (w) { return w !== right; })).slice(0, 3))); return { p: prompt, opts: opts, a: right, info: info || "" }; }
      var gens = {
        books: function () {
          var i = Math.floor(Math.random() * 65), b = G.BOOKS[i];
          return Math.random() < 0.5 ? q("Which section is " + b[0] + " in?", SEC[b[1]].name, secNames, b[4])
            : q("Which book comes right after " + b[0] + "?", G.BOOKS[i + 1][0], shuffle(G.BOOKS.map(function (x) { return x[0]; })).slice(0, 8), G.BOOKS[i + 1][4]);
        },
        story: function () {
          var p = G.PEOPLE[Math.floor(Math.random() * G.PEOPLE.length)];
          if (Math.random() < 0.5) return q("When did " + p[0] + " live?", G.ERAS[p[2]].n, G.ERAS.map(function (x) { return x.n; }), p[3]);
          var i = Math.floor(Math.random() * 11); return q("Which era comes after “" + G.ERAS[i].n + "”?", G.ERAS[i + 1].n, G.ERAS.map(function (x) { return x.n; }), G.ERAS[i + 1].s);
        },
        people: function () { var p = G.PEOPLE[Math.floor(Math.random() * G.PEOPLE.length)]; return q(p[0] + " was a…", p[1][0], ["Patriarch", "Judge", "King", "Prophet", "Apostle", "Priest", "Leader", "Queen", "Woman of faith"], p[3]); },
        prophets: function () { var ns = Object.keys(G.PROPHET_TIME), n = ns[Math.floor(Math.random() * ns.length)], t = G.PROPHET_TIME[n]; return q("When did " + n + " speak?", { before: "Before the exile", during: "During the exile", after: "After the exile" }[t[0]], ["Before the exile", "During the exile", "After the exile"], n + " spoke to: " + t[1] + (t[2] ? " (" + t[2] + ")" : "")); },
        verses: function () { var v = G.VERSES[Math.floor(Math.random() * G.VERSES.length)], t = vtext(gv, v[0]); var words = t.split(" ").slice(0, 12).join(" "); return q("Where does it say: “" + words + "…”?", v[0], G.VERSES.map(function (x) { return x[0]; }), v[1]); }
      };
      var kinds = kind === "mix" ? Object.keys(gens) : [kind === "books" || kind === "story" || kind === "prophets" || kind === "verses" || kind === "people" ? kind : "books"];
      var seen = {};
      for (var n = 0; qs.length < 10 && n < 60; n++) { var k = kinds[n % kinds.length]; var x = gens[k](); if (seen[x.p]) continue; seen[x.p] = 1; qs.push(x); }
      return qs;
    }
    startQuiz(kind) { this.setState({ sec: "quiz", quiz: { kind: kind, qs: this.makeQuiz(kind), i: 0, score: 0, pick: null } }); }
    renderQuiz(g) {
      var self = this, Q = this.state.quiz;
      if (!Q) {
        var kinds = [["mix", "Mixed", "bulb", "#2E8A6C"], ["books", "The 66 books", "book", "#3A6E9C"], ["story", "The story & eras", "hourglass", "#B9822A"], ["people", "People & roles", "person", "#8E4FA3"], ["prophets", "Prophets in time", "flame", "#B44664"], ["verses", "Where is that verse?", "scroll", "#C0603A"]];
        return [h2("Quiz", "10 questions · best score " + (g.best || 0) + "/10"), e("div", { key: "k", style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, paddingBottom: 24 } }, kinds.map(function (k) {
          return card([art(k[2], k[3], 54, "graffiti", hash(k[0])), e("div", { key: "t", style: { font: "600 15px " + SERIF, marginTop: 8 } }, k[1])], { onClick: function () { self.startQuiz(k[0]); }, style: { padding: 14 } });
        }))];
      }
      if (Q.i >= Q.qs.length) {
        return [card([art(Q.score >= 8 ? "crown" : Q.score >= 5 ? "star" : "seed", "#D9A92C", 80, "graffiti"), e("div", { key: "s", style: { font: "600 30px " + SERIF, marginTop: 10 } }, Q.score + " / " + Q.qs.length),
          e("div", { key: "m", style: { font: "500 13px Inter", color: MUTED, margin: "4px 0 14px" } }, Q.score >= 8 ? "Excellent!" : Q.score >= 5 ? "Good going. Again to lock it in." : "Every round helps it stick."),
          e("div", { key: "b", style: { display: "flex", gap: 8 } }, btn("Again", function () { self.startQuiz(Q.kind); }, { flex: 1 }), btn("Other quizzes", function () { self.setState({ quiz: null }); }, { ghost: true, flex: 1 }))], { style: { marginTop: 14, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" } })];
      }
      var q = Q.qs[Q.i], picked = Q.pick;
      var choose = function (o) { if (picked != null) return; var ok = o === q.a, sc = Q.score + (ok ? 1 : 0); self.setState({ quiz: Object.assign({}, Q, { pick: o, score: sc }) }); if (Q.i === Q.qs.length - 1 && sc > (g.best || 0)) self.upd(function (x) { x.best = sc; }); };
      return [e("div", { key: "bar", style: { display: "flex", gap: 3, margin: "14px 0" } }, Q.qs.map(function (_, i) { return e("span", { key: i, style: { flex: 1, height: 5, borderRadius: 3, background: i < Q.i ? TEAL : i === Q.i ? "#D9A92C" : LINE } }); })),
        card([e("div", { key: "n", style: { font: "700 11px Inter", color: MUTED } }, "QUESTION " + (Q.i + 1)), e("div", { key: "p", style: { font: "600 19px/1.3 " + SERIF, margin: "6px 0 14px" } }, q.p),
          e("div", { key: "o", style: { display: "flex", flexDirection: "column", gap: 8 } }, q.opts.map(function (o) {
            var st = picked == null ? CARD : o === q.a ? "#D7EFE3" : o === picked ? "#F6D9DF" : CARD;
            return e("button", { key: o, onClick: function () { choose(o); }, style: { minHeight: 46, border: "1px solid " + (picked != null && o === q.a ? "#2E8A6C" : LINE), background: st, borderRadius: 12, font: "600 14px Inter", color: INK, textAlign: "left", padding: "8px 14px" } }, o);
          })),
          picked != null ? e("div", { key: "i", style: { font: "500 13px/1.45 Inter", color: MUTED, marginTop: 12 } }, (picked === q.a ? "✓ Right. " : "✗ It's " + q.a + ". ") + q.info) : null,
          picked != null ? e("div", { key: "nx", style: { marginTop: 12 } }, btn(Q.i === Q.qs.length - 1 ? "See score" : "Next", function () { self.setState({ quiz: Object.assign({}, Q, { i: Q.i + 1, pick: null }) }); }, { style: { width: "100%" }, h: 44 })) : null])];
    }

    /* ----- TOPICS ----- */
    renderTopics(g) {
      var self = this, mine = g.topics || [];
      var have = {}; mine.forEach(function (t) { have[t.t] = 1; });
      var out = [h2("My topics", "Each topic is your own board: write, map, connect, draw and stencil"),
        e("div", { key: "grid", style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 } }, mine.map(function (t, i) {
          var bd = g.boards["t:" + t.id], n = bd ? bd.items.length : 0;
          return card([e("div", { key: "a", style: { display: "flex", justifyContent: "space-between" } }, art(t.ic || "bulb", ["#B44664", "#2E8A6C", "#3A6E9C", "#B9822A", "#8E4FA3"][i % 5], 52, "graffiti", hash(t.id)), e("span", { style: { font: "600 11px Inter", color: MUTED } }, n ? n + " items" : "new")),
            e("div", { key: "t", style: { font: "600 14px/1.25 " + SERIF, marginTop: 8 } }, t.t)], { onClick: function () { self.openBoard(t); }, style: { padding: 12, minHeight: 120 } });
        }).concat([e("button", { key: "new", onClick: function () { self.setState({ newTopic: "" }); }, style: { border: "2px dashed #CFC4B2", background: "transparent", borderRadius: 16, minHeight: 120, font: "600 14px Inter", color: TEAL } }, "+ New topic")]))];
      out.push(e("div", { key: "sg", style: { margin: "18px 0 24px" } }, e("button", { onClick: function () { self.setState({ showSug: !self.state.showSug }); }, style: { border: "none", background: "transparent", font: "600 14px Inter", color: TEAL, padding: "6px 2px" } }, (this.state.showSug ? "▾ " : "▸ ") + "Topic ideas to add"),
        this.state.showSug ? e("div", { style: { display: "flex", flexDirection: "column", gap: 6, marginTop: 6 } }, SUGGEST.filter(function (s) { return !have[s[0]]; }).map(function (s) {
          return e("div", { key: s[0], style: { display: "flex", alignItems: "center", gap: 10, background: CARD, border: "1px solid " + LINE, borderRadius: 12, padding: "8px 10px" } },
            art((TOPIC_BY[s[1]] || {}).ic || "bulb", "#CFC4B2", 30, "sketch"), e("div", { style: { flex: 1, font: "600 13px/1.3 Inter" } }, s[0]),
            e("button", { onClick: function () { self.addTopic(s[0], (TOPIC_BY[s[1]] || {}).ic, refsOf(s[1])); }, style: { border: "1px solid " + TEAL, background: "transparent", color: TEAL, borderRadius: 10, height: 30, padding: "0 10px", font: "600 12px Inter", flex: "none" } }, "+ Add"));
        })) : null));
      return out;
    }
    addTopic(title, ic, refs) {
      var id = uid("t"), gv = this.props.getVerse;
      this.upd(function (x) { x.topics = (x.topics || []).concat([{ id: id, t: title, ic: ic || "bulb", made: today(), refs: refs || [] }]); });
      this.props.toast && this.props.toast("Added: " + title);
    }
    openBoard(t) {
      var g = this.g(), key = "t:" + t.id, self = this;
      if (!g.boards[key]) {
        var st = STARTERS[t.id], b = starterBoard(t.t, st ? st.r : (t.refs || []), this.props.getVerse, t.ic);
        this.pending = this.pending || {}; this.pending[key] = b;
        this.upd(function (x) { x.boards[key] = b; });
      }
      this.setState({ board: { key: key, title: t.t, topicId: t.id } });
    }
    openItemBoard(key, title, ic) {
      var g = this.g();
      if (!g.boards[key]) { var nb0 = { items: [{ id: uid("n"), type: "stamp", icon: ic || "star", color: "#B9822A", style: "graffiti", x: 0, y: 0, w: 120, h: 120 }, { id: uid("n"), type: "text", text: title, size: 30, color: INK, x: 140, y: 30, w: 420, h: 60 }], links: [] }; this.pending = this.pending || {}; this.pending[key] = nb0; this.upd(function (x) { x.boards[key] = nb0; }); }
      this.setState({ sheet: null, board: { key: key, title: title } });
    }

    /* ----- detail sheets ----- */
    renderSheet(g) {
      var self = this, sh = this.state.sheet, gv = this.props.getVerse; if (!sh) return null;
      var close = function () { self.setState({ sheet: null }); };
      var notes = function (key) { return e("textarea", { key: "notes", value: g.notes[key] || "", placeholder: "My notes…", onInput: function (ev) { var v = ev.target.value; self.upd(function (x) { x.notes[key] = v; }); }, style: Object.assign(inputStyle(), { height: 90, paddingTop: 10, marginTop: 12, font: "600 18px/1.3 " + HAND }) }); };
      var verseBox = function (ref) { var t = vtext(gv, ref); return e("div", { key: "vb", style: { background: CARD, border: "1px solid " + LINE, borderLeft: "5px solid #D9A92C", borderRadius: 12, padding: "10px 12px", marginTop: 12 } }, e("div", { style: { font: "700 12.5px Inter", color: "#8A6A1E" } }, ref), e("div", { style: { font: "15px/1.45 " + SERIF, marginTop: 4 } }, t)); };
      var actions = function (ref, boardKey, title, ic) { return e("div", { key: "act", style: { display: "flex", gap: 8, marginTop: 12 } }, btn("Read", function () { close(); self.props.openRef(firstRef(ref)); }, { flex: 1 }), btn("My board", function () { self.openItemBoard(boardKey, title, ic); }, { ghost: true, flex: 1 })); };
      if (sh.kind === "book") {
        var b = G.BOOKS[sh.i], s = SEC[b[1]], kn = g.known[b[0]];
        return sheetWrap(b[0], [e("div", { key: "h", style: { display: "flex", gap: 12, alignItems: "center" } }, art(b[5], s.c, 76, "graffiti", hash(b[0])),
          e("div", null, e("div", { style: { font: "700 12px Inter", color: s.c } }, s.name.toUpperCase() + " · BOOK " + (sh.i + 1) + " OF 66"), e("div", { style: { font: "500 13px/1.4 Inter", marginTop: 4 } }, "✍ " + b[2]), e("div", { style: { font: "500 13px Inter", color: MUTED } }, "🗓 " + b[3] + " · " + window.GROW_CH[sh.i] + " chapters"))),
          e("div", { key: "s", style: { font: "500 14px/1.5 Inter", marginTop: 12 } }, b[4]), G.PROPHET_TIME[b[0]] ? e("div", { key: "pt", style: { font: "600 12.5px Inter", color: G.AUD_C[G.PROPHET_TIME[b[0]][1]], marginTop: 8 } }, "Spoke " + G.PROPHET_TIME[b[0]][0] + " the exile · to " + G.PROPHET_TIME[b[0]][1]) : null,
          verseBox(b[6]), e("div", { key: "k", style: { display: "flex", alignItems: "center", gap: 10, marginTop: 12 } }, tick(kn, function () { self.upd(function (x) { x.known[b[0]] = !x.known[b[0]]; }); }, s.c), e("span", { style: { font: "600 13px Inter" } }, "I know this book")),
          notes("book:" + b[0]), actions(b[6], "b:book:" + b[0], b[0], b[5]),
          e("div", { key: "nav", style: { display: "flex", justifyContent: "space-between", marginTop: 10 } }, sh.i > 0 ? btn("‹ " + G.BOOKS[sh.i - 1][0], function () { self.open({ kind: "book", i: sh.i - 1 }); }, { ghost: true, h: 34 }) : e("span"), sh.i < 65 ? btn(G.BOOKS[sh.i + 1][0] + " ›", function () { self.open({ kind: "book", i: sh.i + 1 }); }, { ghost: true, h: 34 }) : e("span"))], close);
      }
      if (sh.kind === "era") {
        var er = G.ERAS[sh.i];
        return sheetWrap((sh.i + 1) + ". " + er.n, [e("div", { key: "h", style: { display: "flex", gap: 12, alignItems: "center" } }, duo(er.ic, er.c, 84, hash(er.n)), e("div", null, e("div", { style: { font: "700 13px Inter", color: er.c } }, er.y), e("div", { style: { font: "500 13px/1.4 Inter", color: MUTED, marginTop: 4 } }, "📖 " + er.books))),
          e("div", { key: "s", style: { font: "500 14px/1.5 Inter", marginTop: 12 } }, er.s), verseBox(er.ref), notes("era:" + sh.i), actions(er.ref, "b:era:" + sh.i, er.n, er.ic[0])], close);
      }
      if (sh.kind === "person") {
        var p = G.PEOPLE[sh.i], c = G.ROLE_C[p[1][0]] || "#8A7F70";
        return sheetWrap(p[0], [e("div", { key: "h", style: { display: "flex", gap: 12, alignItems: "center" } }, art(p[5], c, 76, "graffiti", hash(p[0])), e("div", null, e("div", { style: { font: "700 12px Inter", color: c } }, p[1].join(" · ").toUpperCase()), e("div", { style: { font: "500 13px Inter", color: G.ERAS[p[2]].c, marginTop: 4 } }, G.ERAS[p[2]].n + " · " + G.ERAS[p[2]].y))),
          e("div", { key: "s", style: { font: "500 14px/1.5 Inter", marginTop: 12 } }, p[3]), verseBox(p[4]), notes("person:" + p[0]), actions(p[4], "b:person:" + p[0], p[0], p[5])], close);
      }
      if (sh.kind === "cov") {
        var cv = G.COVENANTS[sh.i];
        return sheetWrap("Covenant with " + cv.n, [e("div", { key: "h", style: { display: "flex", gap: 12, alignItems: "center" } }, art(cv.ic, cv.c, 76, "graffiti", sh.i + 11), e("div", { style: { font: "500 14px/1.45 Inter" } }, cv.p)), verseBox(cv.ref), notes("cov:" + sh.i), actions(cv.ref, "b:cov:" + sh.i, "Covenant: " + cv.n, cv.ic)], close);
      }
      if (sh.kind === "verse") {
        var v = G.VERSES[sh.i], st = (g.verses || {})[v[0]];
        return sheetWrap(v[0], [e("div", { key: "h", style: { display: "flex", gap: 12, alignItems: "center" } }, art(v[3], "#B44664", 70, "graffiti", hash(v[0])), e("div", null, e("div", { style: { font: "600 15px " + SERIF } }, v[1]), e("div", { style: { font: "600 17px " + HAND, color: MUTED, marginTop: 4 } }, "When someone says: “" + v[2] + "”"))),
          verseBox(v[0]), notes("verse:" + v[0]),
          e("div", { key: "a", style: { display: "flex", gap: 8, marginTop: 12 } }, btn("Read in context", function () { close(); self.props.openRef(firstRef(v[0])); }, { flex: 1 }),
            st ? btn("Practise now", function () { self.upd(function (x) { x.verses[v[0]].due = today(); }); self.setState({ sheet: null, deck: sh.i, reveal: false }); }, { ghost: true, flex: 1 }) : btn("+ Learn it", function () { self.upd(function (x) { x.verses[v[0]] = { box: 0, due: today() }; }); close(); }, { ghost: true, flex: 1 })),
          st ? e("button", { key: "rm", onClick: function () { self.upd(function (x) { delete x.verses[v[0]]; }); close(); }, style: { border: "none", background: "transparent", color: "#8A2943", font: "600 12px Inter", marginTop: 10 } }, "Remove from my deck") : null], close);
      }
      return null;
    }

    render() {
      var self = this, g = this.g(), S = this.state, H = this.props.paneH || 600;
      if (S.board) {
        var bk = S.board.key;
        return e("div", { style: { position: "relative", height: H } }, e(Board, {
          key: bk, board: g.boards[bk] || (this.pending || {})[bk], title: S.board.title, getVerse: this.props.getVerse, openRef: this.props.openRef, toast: this.props.toast,
          onChange: function (nb) { self.upd(function (x) { x.boards[bk] = nb; }); },
          onRename: S.board.topicId ? function (t) { self.upd(function (x) { x.topics = x.topics.map(function (tp) { return tp.id === S.board.topicId ? Object.assign({}, tp, { t: t }) : tp; }); }); self.setState({ board: Object.assign({}, S.board, { title: t }) }); } : null,
          onClose: function () { self.setState({ board: null }); }
        }));
      }
      var secs = [["plan", "Plan"], ["basics", "Basics"], ["verses", "Verses"], ["quiz", "Quiz"], ["topics", "Topics"]];
      var body = S.sec === "plan" ? this.renderPlan(g) : S.sec === "basics" ? this.renderBasics(g) : S.sec === "verses" ? this.renderVerses(g) : S.sec === "quiz" ? this.renderQuiz(g) : this.renderTopics(g);
      var newSheet = S.newTopic != null ? sheetWrap("New topic", [e("input", { key: "i", ref: foc, value: S.newTopic, placeholder: "e.g. Who is the Angel of the LORD?", onInput: function (ev) { self.setState({ newTopic: ev.target.value }); }, style: inputStyle() }),
        e("div", { key: "b", style: { display: "flex", gap: 8, marginTop: 10 } }, btn("Create", function () { var t = S.newTopic.trim(); if (t) self.addTopic(t, "bulb", []); self.setState({ newTopic: null }); }, { flex: 1 }))], function () { self.setState({ newTopic: null }); }) : null;
      return e("div", { style: { position: "relative", height: H, display: "flex", flexDirection: "column", background: PAPER } },
        e("div", { style: { flex: "none", padding: "8px 12px 6px", background: "#FBF8F2", borderBottom: "1px solid " + LINE } },
          e("div", { style: { display: "grid", gridTemplateColumns: "repeat(5, minmax(0,1fr))", gap: 2, background: "#F2ECE1", borderRadius: 10, padding: 2, height: 32 } }, secs.map(function (s) {
            var on = S.sec === s[0];
            return e("button", { key: s[0], onClick: function () { self.setState({ sec: s[0], sheet: null }); }, style: { border: "none", borderRadius: 8, background: on ? "#FFFDF8" : "transparent", color: on ? INK : MUTED, boxShadow: on ? "0 1px 3px rgba(40,30,10,0.12)" : "none", font: "600 12px Inter" } }, s[1]);
          }))),
        e("div", { style: { flex: 1, overflowY: "auto", padding: "0 14px", WebkitOverflowScrolling: "touch" } }, body),
        this.renderSheet(g), newSheet);
    }
  }
  DC.register("GrowTab", GrowTab);
  window.GROW_ART = art;
})();
