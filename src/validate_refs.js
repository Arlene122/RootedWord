// node src/validate_refs.js $PWD/src/grow_data.js $PWD/data/kjv.json
global.window={}; require(process.argv[2]); const G=window.GROW; const K=require(process.argv[3]);
const NAMES=["Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi","Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"];
let bad=0,n=0;
function chk(r,src){ r.split(";").forEach(x=>{x=x.trim(); const m=/^(.+?)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/.exec(x); n++;
 if(!m){console.log("FORMAT",src,x);bad++;return;} const b=NAMES.indexOf(m[1]); if(b<0){console.log("BOOK",src,x);bad++;return;}
 const c=+m[2]; if(!K[b][c-1]){console.log("CHAP",src,x);bad++;return;} if(m[3]){ const e=m[4]?+m[4]:+m[3]; if(!K[b][c-1][e-1]){console.log("VERSE",src,x);bad++;} } });}
G.BOOKS.forEach((b,i)=>{ if(b[0]!==NAMES[i]) console.log("ORDER",b[0]); chk(b[6],"book"); });
G.ERAS.forEach(e=>chk(e.ref,"era")); G.PEOPLE.forEach(p=>chk(p[4],"person "+p[0])); G.COVENANTS.forEach(c=>chk(c.ref,"cov"));
G.VERSES.forEach(v=>chk(v[0],"verse")); G.TOPICS.forEach(t=>t.b.forEach(b=>b[1]&&chk(b[1],t.id))); G.PATH.forEach(p=>chk(p[1],"path"));
console.log("refs",n,"bad",bad, "books",G.BOOKS.length,"topics",G.TOPICS.length);
