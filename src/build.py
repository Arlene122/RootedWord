import re, json, os, shutil, sys
SRC = "/home/claude/biblemock/project"
ASSETS = "/home/claude/biblemock/assets"
B = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1] if len(sys.argv) > 1 else "/home/claude/rootedword"
VEND = "/tmp/vend/node_modules"

def rep(s, a, b, count=1, regex=False):
    if regex:
        s2, n = re.subn(a, b, s)
    else:
        n = s.count(a); s2 = s.replace(a, b)
    if n != count:
        raise SystemExit("patch count %d != %d for %r" % (n, count, a[:80]))
    return s2

def split(name):
    t = open(os.path.join(SRC, name + ".dc.html"), encoding="utf-8").read()
    tpl = re.search(r"<x-dc>(.*)</x-dc>", t, re.S).group(1)
    js = re.search(r"<script type=\"text/x-dc\"[^>]*>(.*)</script>", t, re.S).group(1)
    tpl = re.sub(r"<!--.*?-->", "", tpl, flags=re.S)
    return tpl, js

URLS = {
    "/_blob/ca1ff89047a59b457e289ed1b1ca49fc": "data/kjv.json",
    "/_blob/10348d5d296def5ba380fa7043d6d505": "data/connections.json",
    "/_blob/e3b58f87ff8200f1dfde87cc3ad33c8e": "data/family.json",
}
FETCH = r"fetch\(([A-Z_]+_URL)\)\.then\(function \(r\) \{ return r\.json\(\); \}\)"

comps = {}
for name in ["TimelinePane", "FamilyTree", "BooksExplorer", "AuthorsViz", "ConnectionsWheel", "MapJourneys", "Main"]:
    tpl, js = split(name)
    for a, b in URLS.items():
        js = js.replace(a, b)
    js = re.sub(FETCH, r"RW.json(\1)", js)
    comps[name] = [tpl, js]

c = comps["ConnectionsWheel"]; c[1] = rep(c[1], ' links in this mockup: ', ' links: ')
# ---------- Main patches ----------
tpl, js = comps["Main"]
tpl = rep(tpl, 'width: 390px; height: 844px;', 'width: 390px; height: {{appH}}px;')
tpl = rep(tpl, 'pane-h="{{680}}"', 'pane-h="{{paneViz}}"', 3)
tpl = rep(tpl, 'pane-h="{{724}}"', 'pane-h="{{paneFull}}"', 2)
tpl = rep(tpl, '>AS</span>', '>{{userInit}}</span>', 2)
tpl = rep(tpl, '>Arlene Schmidt</div>', '>{{userName}}</div>')
tpl = rep(tpl, '>Synced across your devices</div>', '>{{syncText}}</div>')
tpl = rep(tpl, '<div style="font: 600 20px \'Source Serif 4\', serif">6</div><div style="font: 500 10.5px Inter, sans-serif; color: #6B6255">Streak</div>',
          '<div style="font: 600 20px \'Source Serif 4\', serif">{{cTopics}}</div><div style="font: 500 10.5px Inter, sans-serif; color: #6B6255">Topics</div>')
tpl = rep(tpl, 'grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2px; background: #F2ECE1; border-radius: 12px; padding: 3px">\n          <sc-for list="{{transOpts}}"',
          'grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 2px; background: #F2ECE1; border-radius: 12px; padding: 3px">\n          <sc-for list="{{transOpts}}"')
tpl = rep(tpl, '>NIV, ESV and NLT can be added once licensed.</div>', '>KJV works offline. NLT needs internet. ESV is coming soon.</div>')
tpl = rep(tpl, '>King James Version · public domain</div>', '>{{transNotice}}</div>')
tpl = rep(tpl, 'Today · Day 12 of 90', 'Suggested reading')
tpl = rep(tpl, '<div style="font: 600 26px \'Source Serif 4\', Georgia, serif">6</div>\n          <div style="font: 500 12px Inter, sans-serif; color: #6B6255">day streak</div>', '<div style="font: 600 26px \'Source Serif 4\', Georgia, serif">{{cHl}}</div>\n          <div style="font: 500 12px Inter, sans-serif; color: #6B6255">highlights</div>')
tpl = rep(tpl, '<button onClick="{{signOut}}"', '<button onClick="{{installApp}}" style="display: {{installShow}}; height: 44px; border: none; border-radius: 12px; background: #1F5E5B; color: #F7F3EC; font: 600 14px Inter, sans-serif">Add to home screen</button>\n      <button onClick="{{signOut}}"')

js = rep(js, 'titles = { home: "Selah"', 'titles = { home: "RootedWord"')
js = rep(js, 'hl: { "0:22:2": "blue", "0:22:8": "yellow", "0:22:14": "green" }, notes: { "0:22:8": "Lamb provided → John 1:29. God sees AND provides." }', 'hl: {}, notes: {}')
js = rep(js, 'marks: { moriah: "#D9822B", david: "#3A6E9C" }, tlNotes: { moriah: "Same mountain as the Temple! (2 Chr 3:1)" }', 'marks: {}, tlNotes: {}')
js = rep(js, 'var h1 = S.split ? 306 : 636;', 'var h2 = Math.round((RW.H - 208) * 0.48), h1 = S.split ? h2 : RW.H - 208;')
js = rep(js, 'h1: h1, h2: 306,', 'h1: h1, h2: h2, appH: RW.H, paneViz: RW.H - 164, paneFull: RW.H - 120, userInit: RW.user().init, userName: RW.user().name, syncText: RW.syncText(), cTopics: S.topics.length, installShow: RW.canInstall() ? "block" : "none", installApp: function () { RW.install(); }, transNotice: RW.notice(S.trans),')
js = rep(js, 'var chapArr = this.chapter(S.rb, S.rc) || [];', 'var chapArr = RW.chapter(this, S) || this.chapter(S.rb, S.rc) || [];')
js = rep(js, 'opt(["KJV", "WEB"], S.trans, "trans")', 'opt(["KJV", "NLT", "ESV"], S.trans, "trans")')
js = rep(js, 'if (key === "trans" && l === "WEB") self.toastMsg("Mockup shows KJV text; WEB loads in the real app.");',
         'if (key === "trans" && l !== "KJV") RW.pickTrans(self, l);')
js = rep(js, 'signOut: function () { self.toastMsg("Mockup: sign-out happens in the real app."); },', 'signOut: function () { RW.signOut(); },')
js += "\nComponent = RW.wrapMain(Component, DEF);\n"
comps["Main"] = [tpl, js]

# ---------- assemble ----------
parts = []
for name, (tpl, js) in comps.items():
    parts.append("DC.define(%s, %s, function (DCLogic) {\n%s\nreturn Component;\n});" % (json.dumps(name), json.dumps(tpl), js))
components_js = "\n\n".join(parts)

def rd(p): return open(p, encoding="utf-8").read()
shell = rd(os.path.join(B, "shell.html"))
shell = shell.replace("/*PREACT*/", rd(VEND + "/preact/dist/preact.umd.js"))
shell = shell.replace("/*SUPABASE*/", rd(VEND + "/@supabase/supabase-js/dist/umd/supabase.js").replace("</script", "<\\/script"))
shell = shell.replace("/*DC*/", rd(os.path.join(B, "dc.js")))
shell = shell.replace("/*APP*/", rd(os.path.join(B, "app.js")))
shell = shell.replace("/*COMPONENTS*/", components_js.replace("</script", "<\\/script"))
os.makedirs(OUT, exist_ok=True)
open(os.path.join(OUT, "index.html"), "w", encoding="utf-8").write(shell)
os.makedirs(os.path.join(OUT, "data"), exist_ok=True)
for f in ["kjv.json", "connections.json", "family.json"]:
    shutil.copy(os.path.join(ASSETS, f), os.path.join(OUT, "data", f))
for f in ["sw.js", "manifest.webmanifest", "README.md", ".nojekyll"]:
    shutil.copy(os.path.join(B, f), os.path.join(OUT, f))
shutil.copytree(os.path.join(B, "icons"), os.path.join(OUT, "icons"), dirs_exist_ok=True)
print("built", OUT, os.path.getsize(os.path.join(OUT, "index.html")))
