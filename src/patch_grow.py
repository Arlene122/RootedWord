"""Adds the Grow tab + Cornerstone rename to the built index.html (index.html is now the source of truth for Main etc.).
Run once on a pre-Grow index.html:  python3 src/patch_grow.py
Re-inject only grow code after edits:  python3 src/patch_grow.py --code-only"""
import json, os, re, sys
B = os.path.dirname(os.path.abspath(__file__)); R = os.path.dirname(B)
IDX = os.path.join(R, "index.html")
s = open(IDX, encoding="utf-8").read()

def rep(t, a, b, n=1):
    c = t.count(a)
    if c != n: raise SystemExit("count %d != %d for %r" % (c, n, a[:90]))
    return t.replace(a, b)

code = open(os.path.join(B, "grow_data.js"), encoding="utf-8").read() + "\n" + open(os.path.join(B, "grow.js"), encoding="utf-8").read()
code = code.replace("</script", "<\\/script")
START, END = "/*GROW-START*/", "/*GROW-END*/"
if START in s:
    i, j = s.index(START), s.index(END) + len(END)
    s = s[:i] + START + "\n" + code + "\n" + END + s[j:]
    if "--code-only" in sys.argv:
        open(IDX, "w", encoding="utf-8").write(s); print("grow code updated"); sys.exit()
else:
    s = rep(s, 'DC.define("TimelinePane", ', START + "\n" + code + "\n" + END + '\nDC.define("TimelinePane", ')

# ---- Main template (JSON string) ----
k = s.index('DC.define("Main", ') + len('DC.define("Main", ')
tpl, end = json.JSONDecoder().raw_decode(s[k:])
if "GrowTab" not in tpl:
    tpl = rep(tpl, '  <sc-if value="{{isMap}}"', '  <sc-if value="{{isGrow}}" hint-placeholder-val="{{false}}">\n    <div style="position: absolute; inset: 0">\n      <dc-import name="GrowTab" pane-h="{{paneFull}}" grow="{{growState}}" on-grow="{{growChange}}" open-ref="{{openRefFn}}" get-verse="{{getVerseFn}}" toast="{{toastFn}}"></dc-import>\n    </div>\n  </sc-if>\n\n  <sc-if value="{{isMap}}"')
    tpl = rep(tpl, 'height: 64px; flex: none; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr))', 'height: 64px; flex: none; display: grid; grid-template-columns: repeat(6, minmax(0, 1fr))')
    a = tpl.index('  <button onClick="{{tabRead}}"'); b = tpl.index('</button>', a) + len('</button>')
    rb = tpl[a:b]
    gb = rb.replace("tabRead", "tabGrow").replace("inkRead", "inkGrow").replace("bgRead", "bgGrow")
    gb = re.sub(r'<svg[^>]*>.*?</svg>', '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21V11"></path><path d="M12 13C12 8 8.5 5 4 5c0 5 3.5 8 8 8z"></path><path d="M12 11c0-4 3-7 8-7 0 4-3 7-8 7z"></path></svg>', gb, flags=re.S)
    gb = gb.replace("</span>Read", "</span>Grow")
    if "</span>Grow" not in gb: raise SystemExit("label not found")
    tpl = tpl[:b] + "\n" + gb + tpl[b:]
    s = s[:k] + json.dumps(tpl) + s[k + end:]

# ---- Main js ----
if "isGrow:" not in s:
    s = rep(s, 'isMap: tab === "map",', 'isMap: tab === "map", isGrow: tab === "grow", inkGrow: ink("grow"), bgGrow: bg("grow"), tabGrow: function () { self.go("grow"); }, growState: S.grow || null, growChange: function (g) { self.setState({ grow: g }); },')
    s = rep(s, 'threads: "Connections", map: "Map & journeys" };', 'threads: "Connections", map: "Map & journeys", grow: "Grow" };')

# ---- app glue: sync grow ----
def glue(t):
    if '"grow"' in t: return t
    t = rep(t, 'var KEEP = ["hl", "notes", "bm", "marks", "tlNotes", "topics", "trans", "theme"];', 'var KEEP = ["hl", "notes", "bm", "marks", "tlNotes", "topics", "trans", "theme", "grow"];')
    t = rep(t, 'var KV = ["bm", "marks", "tlNotes", "topics", "prefs"];', 'var KV = ["bm", "marks", "tlNotes", "topics", "prefs", "grow"];')
    t = rep(t, 'topics: d.topics, prefs: { trans: d.trans, theme: d.theme } };', 'topics: d.topics, grow: d.grow, prefs: { trans: d.trans, theme: d.theme } };')
    t = rep(t, '["bm", "marks", "tlNotes", "topics"].forEach', '["bm", "marks", "tlNotes", "topics", "grow"].forEach')
    return t
s = glue(s)
ap = os.path.join(B, "app.js"); _a = glue(open(ap, encoding="utf-8").read()); open(ap, "w", encoding="utf-8").write(_a)

# ---- rename (optional): --name NEW [--from OLD] ----
if "--name" in sys.argv:
    NEW = sys.argv[sys.argv.index("--name") + 1]; OLD = sys.argv[sys.argv.index("--from") + 1] if "--from" in sys.argv else "Deeper"
    for f in [IDX, os.path.join(R, "manifest.webmanifest"), os.path.join(R, "README.md"), os.path.join(B, "shell.html"), ap, os.path.join(R, "sw.js")]:
        t = s if f == IDX else open(f, encoding="utf-8").read()
        t = t.replace(OLD, NEW)
        if f == IDX: s = t
        else: open(f, "w", encoding="utf-8").write(t)
sw = os.path.join(R, "sw.js"); t = open(sw, encoding="utf-8").read(); t = re.sub(r'const V = "rw-v(\d+)";', lambda m: 'const V = "rw-v%d";' % (int(m.group(1)) + 1), t, 1); open(sw, "w", encoding="utf-8").write(t)
open(IDX, "w", encoding="utf-8").write(s)
print("patched", len(s))
