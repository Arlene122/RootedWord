import json, os, re, glob, html
M = "/tmp/orig/node_modules/@metaxia"
OUT = "/home/claude/rwbuild/orig"
OSIS = "Gen,Exod,Lev,Num,Deut,Josh,Judg,Ruth,1Sam,2Sam,1Kgs,2Kgs,1Chr,2Chr,Ezra,Neh,Esth,Job,Ps,Prov,Eccl,Song,Isa,Jer,Lam,Ezek,Dan,Hos,Joel,Amos,Obad,Jonah,Mic,Nah,Hab,Zeph,Hag,Zech,Mal,Matt,Mark,Luke,John,Acts,Rom,1Cor,2Cor,Gal,Eph,Phil,Col,1Thess,2Thess,1Tim,2Tim,Titus,Phlm,Heb,Jas,1Pet,2Pet,1John,2John,3John,Jude,Rev".split(",")
CANT = re.compile("[֑-ֽ֯׀׃]")
used = set()
def heb(w):
    o = CANT.sub("", w["hebrew"]).replace("\\", "").replace("/", "")
    o = o.replace("־", "־")  # maqaf kept
    tr = w["transliteration"].replace("/", "").replace(".", "")
    gl = re.sub(r"/\s*", " ", w["translation"]).replace("<", "").replace(">", "").strip()
    st = (w["roots"] or [""])[0]
    st = re.sub(r"[A-Z]$", "", st) if st else ""
    if st: used.add(st)
    return [o, tr, gl, st]
n = 0
for bi, b in enumerate(OSIS[:39]):
    for f in glob.glob(f"{M}/scriptures-source-stepbible-tahot/data/stepbible-tahot/{b}/*.json"):
        c = int(os.path.basename(f)[:-5]); d = json.load(open(f))
        out = {}
        for k, ws in d.items():
            vv = {}
            for w in ws: vv.setdefault(w["verse"], []).append(heb(w))
            for v, arr in vv.items(): out.setdefault(str(v), []).extend(arr)
        os.makedirs(f"{OUT}/{bi}", exist_ok=True)
        json.dump(out, open(f"{OUT}/{bi}/{c}.json", "w"), ensure_ascii=False, separators=(",", ":")); n += 1
for bi, b in enumerate(OSIS[39:], 39):
    chs = {}
    for f in glob.glob(f"{M}/scriptures-source-stepbible-tagnt-tr/data/stepbible-tagnt-tr/{b}/*/*.json"):
        c = int(f.split("/")[-2]); v = int(os.path.basename(f)[:-5]); d = json.load(open(f))
        arr = []
        for w in d["words"]:
            ed = w.get("metadata", {}).get("editions", "TR")
            if "TR" not in ed: continue
            m = re.search(r"\(([^)]*)\)", w.get("source", {}).get("raw", ""))
            st = (w.get("strongs") or [""])[0]
            st = re.sub(r"[A-Z]$", "", st) if st else ""
            if st: used.add(st)
            arr.append([w["text"], m.group(1) if m else "", w.get("translation", "").replace("<", "").replace(">", ""), st])
        chs.setdefault(c, {})[str(v)] = arr
    for c, out in chs.items():
        os.makedirs(f"{OUT}/{bi}", exist_ok=True)
        json.dump(out, open(f"{OUT}/{bi}/{c}.json", "w"), ensure_ascii=False, separators=(",", ":")); n += 1
# lexicon
lex = {}
def clean(s):
    s = re.sub(r"<[^>]+>", " ", s or ""); s = html.unescape(s); s = re.sub(r"\s+", " ", s).strip()
    return s[:220] + ("…" if len(s) > 220 else "")
for f in ["stepbible-tbesh.json", "stepbible-tbesg.json"]:
    d = json.load(open(f"{M}/scriptures-source-stepbible-lexicon/data/{f}"))
    for k, e in d.items():
        kk = re.sub(r"[A-Z]$", "", k)
        if kk in used and kk not in lex:
            lex[kk] = [e.get("lemma", ""), e.get("transliteration", ""), e.get("gloss", ""), clean(e.get("definition", ""))]
json.dump(lex, open(f"{OUT}/lex.json", "w"), ensure_ascii=False, separators=(",", ":"))
print("chapters", n, "lex", len(lex), "missing", len(used - set(lex)))
