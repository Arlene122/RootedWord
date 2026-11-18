/* Grow tab data: books, eras, people, covenants, verses, topics, reading path. Refs use full book names. */
(function () {
  var G = window.GROW = {};
  window.GROW_CH = [50,40,27,36,34,24,21,4,31,24,22,25,29,36,10,13,10,42,150,31,12,8,66,52,5,48,12,14,3,9,1,4,7,3,3,3,2,14,4,28,16,24,21,28,16,16,13,6,6,4,4,5,3,6,4,3,1,13,5,5,3,5,1,1,1,22];

  G.SECTIONS = [
    { id: "law", name: "Law", c: "#B9822A", t: "OT" },
    { id: "hist", name: "History", c: "#C0603A", t: "OT" },
    { id: "wis", name: "Wisdom & Poetry", c: "#8E4FA3", t: "OT" },
    { id: "maj", name: "Major Prophets", c: "#B44664", t: "OT" },
    { id: "min", name: "Minor Prophets", c: "#D2697F", t: "OT" },
    { id: "gos", name: "Gospels", c: "#2E8A6C", t: "NT" },
    { id: "acts", name: "Church History", c: "#5D7F2E", t: "NT" },
    { id: "paul", name: "Paul's Letters", c: "#3A6E9C", t: "NT" },
    { id: "gen", name: "General Letters", c: "#2A6F8A", t: "NT" },
    { id: "rev", name: "Prophecy", c: "#8A2943", t: "NT" }
  ];

  // [name, section, who wrote it (traditional view), approx date, what it's about, icon, key ref]
  G.BOOKS = [
    ["Genesis", "law", "Moses (traditionally)", "c. 1440–1400 BC", "Beginnings: creation, the Fall, the flood, Babel, then Abraham, Isaac, Jacob and Joseph.", "sun", "Genesis 1:1"],
    ["Exodus", "law", "Moses", "c. 1440–1400 BC", "God rescues Israel from Egypt, gives the Ten Commandments and the tabernacle.", "tablets", "Exodus 20:2"],
    ["Leviticus", "law", "Moses", "c. 1440–1400 BC", "How a holy God lives among his people: sacrifices, priests, feasts, holiness.", "flame", "Leviticus 19:2"],
    ["Numbers", "law", "Moses", "c. 1440–1400 BC", "40 years in the wilderness: counting the people, grumbling, and God's faithfulness.", "tent", "Numbers 6:24"],
    ["Deuteronomy", "law", "Moses", "c. 1406 BC", "Moses' farewell sermons before Israel enters the land: love God, obey, remember.", "scroll", "Deuteronomy 6:4"],
    ["Joshua", "hist", "Joshua (mostly)", "c. 1400–1370 BC", "Israel crosses the Jordan, Jericho falls, the land is taken and shared out.", "wall", "Joshua 1:9"],
    ["Judges", "hist", "Unknown (perhaps Samuel)", "c. 1050 BC", "A cycle of sin, oppression, crying out and rescue through judges like Gideon and Samson.", "sword", "Judges 21:25"],
    ["Ruth", "hist", "Unknown", "c. 1000 BC", "A Moabite widow's loyalty; Boaz redeems her, and she becomes David's great-grandmother.", "wheat", "Ruth 1:16"],
    ["1 Samuel", "hist", "Unknown (Samuel, Nathan, Gad)", "c. 930 BC", "Samuel, Israel asks for a king, Saul's fall and David's rise.", "lamp", "1 Samuel 16:7"],
    ["2 Samuel", "hist", "Unknown", "c. 930 BC", "David's reign: victories, God's covenant with him, his sin with Bathsheba and its fallout.", "harp", "2 Samuel 7:16"],
    ["1 Kings", "hist", "Unknown (perhaps Jeremiah)", "c. 560 BC", "Solomon and the Temple, the kingdom splits in two, Elijah confronts Baal.", "temple", "1 Kings 18:21"],
    ["2 Kings", "hist", "Unknown", "c. 560 BC", "Elisha, the kings of Israel and Judah, Israel falls to Assyria, Judah to Babylon.", "flame", "2 Kings 17:7"],
    ["1 Chronicles", "hist", "Ezra (traditionally)", "c. 430 BC", "Genealogies from Adam, then David's reign retold with focus on worship.", "crown", "1 Chronicles 16:34"],
    ["2 Chronicles", "hist", "Ezra (traditionally)", "c. 430 BC", "Solomon to the exile, focused on Judah, the Temple and revival under good kings.", "trumpet", "2 Chronicles 7:14"],
    ["Ezra", "hist", "Ezra", "c. 440 BC", "Exiles return from Babylon, rebuild the Temple; Ezra teaches the Law.", "book", "Ezra 7:10"],
    ["Nehemiah", "hist", "Nehemiah", "c. 430 BC", "Jerusalem's walls rebuilt in 52 days despite opposition; the people renew the covenant.", "wall", "Nehemiah 8:10"],
    ["Esther", "hist", "Unknown", "c. 450 BC", "A Jewish queen in Persia risks her life to save her people. God is never named but always at work.", "crown", "Esther 4:14"],
    ["Job", "wis", "Unknown", "Setting: time of the patriarchs", "A righteous man suffers; his friends argue; God answers from the whirlwind.", "cloud", "Job 19:25"],
    ["Psalms", "wis", "David, Asaph, sons of Korah, Moses and others", "c. 1440–450 BC", "150 songs and prayers: praise, lament, trust, kingship, the Messiah.", "harp", "Psalms 23:1"],
    ["Proverbs", "wis", "Solomon (mostly), Agur, Lemuel", "c. 950–700 BC", "Short sayings for wise living. Wisdom begins with the fear of the LORD.", "key", "Proverbs 3:5"],
    ["Ecclesiastes", "wis", "The Preacher (traditionally Solomon)", "c. 935 BC", "Life 'under the sun' is vapour without God. Fear God and keep his commandments.", "hourglass", "Ecclesiastes 12:13"],
    ["Song of Solomon", "wis", "Solomon", "c. 960 BC", "A love poem celebrating marriage and faithful love.", "heart", "Song of Solomon 8:7"],
    ["Isaiah", "maj", "Isaiah", "c. 740–680 BC", "Judgment and comfort; the virgin's child, the suffering servant, new heavens and earth.", "sheep", "Isaiah 53:5"],
    ["Jeremiah", "maj", "Jeremiah (with Baruch)", "c. 627–580 BC", "The weeping prophet warns Judah before Babylon; promises a new covenant.", "well", "Jeremiah 31:33"],
    ["Lamentations", "maj", "Jeremiah (traditionally)", "c. 586 BC", "Five poems of grief over Jerusalem's fall, with hope in God's mercies.", "cloud", "Lamentations 3:22"],
    ["Ezekiel", "maj", "Ezekiel", "c. 593–570 BC", "Visions in exile: God's glory leaves the Temple, dry bones live, a new Temple.", "eye", "Ezekiel 36:26"],
    ["Daniel", "maj", "Daniel", "c. 605–530 BC", "Faithful in Babylon: the fiery furnace, the lions' den, visions of kingdoms to come.", "lion", "Daniel 2:44"],
    ["Hosea", "min", "Hosea", "c. 755–715 BC", "Hosea marries an unfaithful wife, a picture of God's love for unfaithful Israel.", "rings", "Hosea 6:6"],
    ["Joel", "min", "Joel", "Date debated", "A locust plague points to the Day of the LORD; God will pour out his Spirit.", "wheat", "Joel 2:28"],
    ["Amos", "min", "Amos", "c. 760 BC", "A shepherd calls out Israel's injustice: let justice roll down like waters.", "sheep", "Amos 5:24"],
    ["Obadiah", "min", "Obadiah", "Date debated (c. 586 BC?)", "Judgment on Edom for gloating over Jerusalem's fall. The shortest OT book.", "mountain", "Obadiah 1:15"],
    ["Jonah", "min", "Jonah (traditionally)", "c. 760 BC", "A prophet runs from God, is swallowed by a great fish, and Nineveh repents.", "fish", "Jonah 2:9"],
    ["Micah", "min", "Micah", "c. 735–700 BC", "Judgment and hope; the ruler born in Bethlehem; do justly, love mercy, walk humbly.", "star", "Micah 6:8"],
    ["Nahum", "min", "Nahum", "c. 650 BC", "Nineveh's coming fall. The LORD is slow to anger but will not acquit the wicked.", "shield", "Nahum 1:7"],
    ["Habakkuk", "min", "Habakkuk", "c. 607 BC", "A prophet questions God about evil. The just shall live by his faith.", "scroll", "Habakkuk 2:4"],
    ["Zephaniah", "min", "Zephaniah", "c. 630 BC", "The Day of the LORD is near, but God will rejoice over his people with singing.", "trumpet", "Zephaniah 3:17"],
    ["Haggai", "min", "Haggai", "520 BC", "Returned exiles are told to stop neglecting the Temple and rebuild it.", "temple", "Haggai 1:8"],
    ["Zechariah", "min", "Zechariah", "c. 520–480 BC", "Visions for the rebuilders; the King coming on a donkey; the pierced one.", "lamp", "Zechariah 4:6"],
    ["Malachi", "min", "Malachi", "c. 430 BC", "Last OT prophet: half-hearted worship called out; Elijah will come before the Day.", "sun", "Malachi 3:1"],
    ["Matthew", "gos", "Matthew (Levi), the tax collector", "c. AD 50–65", "Jesus the promised King and Messiah, fulfilling the Old Testament. Sermon on the Mount.", "crown", "Matthew 16:16"],
    ["Mark", "gos", "John Mark (Peter's account, traditionally)", "c. AD 55–65", "The fast-paced Gospel: Jesus the servant who came to give his life as a ransom.", "lion", "Mark 10:45"],
    ["Luke", "gos", "Luke the doctor", "c. AD 60", "A careful, ordered account: Jesus the Saviour for outsiders, the poor and the lost.", "person", "Luke 19:10"],
    ["John", "gos", "John the apostle", "c. AD 85–95", "Seven signs and seven 'I AM' sayings, written so you may believe Jesus is the Son of God.", "book", "John 20:31"],
    ["Acts", "acts", "Luke", "c. AD 62", "The Spirit comes; the church spreads from Jerusalem to Rome through Peter and Paul.", "flame", "Acts 1:8"],
    ["Romans", "paul", "Paul", "c. AD 57", "The gospel explained: all have sinned, justified by faith, life in the Spirit.", "key", "Romans 1:16"],
    ["1 Corinthians", "paul", "Paul", "c. AD 55", "Fixing a messy church: divisions, morality, gifts, love, and the resurrection.", "heart", "1 Corinthians 13:13"],
    ["2 Corinthians", "paul", "Paul", "c. AD 56", "Paul defends his ministry: strength in weakness, treasure in jars of clay.", "lamp", "2 Corinthians 12:9"],
    ["Galatians", "paul", "Paul", "c. AD 49–55", "Freedom in Christ: saved by faith, not by keeping the law. Fruit of the Spirit.", "tree", "Galatians 2:20"],
    ["Ephesians", "paul", "Paul (from prison)", "c. AD 60–62", "Who we are in Christ, one body, and the armour of God.", "shield", "Ephesians 2:8"],
    ["Philippians", "paul", "Paul (from prison)", "c. AD 60–62", "Joy in every circumstance; the humility of Christ.", "sun", "Philippians 4:13"],
    ["Colossians", "paul", "Paul (from prison)", "c. AD 60–62", "Christ is supreme over everything; all the fulness of God dwells in him.", "crown", "Colossians 1:16"],
    ["1 Thessalonians", "paul", "Paul", "c. AD 50", "Encouragement for a young church; Jesus will return.", "trumpet", "1 Thessalonians 4:16"],
    ["2 Thessalonians", "paul", "Paul", "c. AD 51", "Clearing up confusion about the Day of the Lord; keep working.", "hourglass", "2 Thessalonians 3:3"],
    ["1 Timothy", "paul", "Paul", "c. AD 62–64", "Instructions to a young pastor: leaders, worship, sound teaching.", "staff", "1 Timothy 4:12"],
    ["2 Timothy", "paul", "Paul (last letter)", "c. AD 66–67", "Paul's final words: guard the gospel, preach the Word, finish the race.", "scroll", "2 Timothy 3:16"],
    ["Titus", "paul", "Paul", "c. AD 63", "Setting up the church on Crete; grace teaches us to live well.", "staff", "Titus 3:5"],
    ["Philemon", "paul", "Paul", "c. AD 60–62", "A personal letter asking Philemon to welcome back Onesimus, a runaway slave, as a brother.", "letter", "Philemon 1:16"],
    ["Hebrews", "gen", "Unknown", "c. AD 60s", "Jesus is better: better than angels, Moses, priests and sacrifices. The hall of faith.", "tent", "Hebrews 11:1"],
    ["James", "gen", "James, Jesus' brother", "c. AD 45–50", "Practical faith: trials, the tongue, faith that works.", "flame", "James 1:22"],
    ["1 Peter", "gen", "Peter", "c. AD 62–64", "Hope while suffering; living as God's chosen people.", "mountain", "1 Peter 3:15"],
    ["2 Peter", "gen", "Peter", "c. AD 65–68", "Grow in grace, beware false teachers, the Lord is not slow.", "lamp", "2 Peter 3:9"],
    ["1 John", "gen", "John the apostle", "c. AD 85–95", "God is light, God is love. How to know you have eternal life.", "heart", "1 John 4:8"],
    ["2 John", "gen", "John (\"the elder\")", "c. AD 85–95", "Walk in truth and love; don't welcome false teachers.", "letter", "2 John 1:6"],
    ["3 John", "gen", "John (\"the elder\")", "c. AD 85–95", "Praise for Gaius' hospitality; a warning about Diotrephes.", "letter", "3 John 1:4"],
    ["Jude", "gen", "Jude, Jesus' brother", "c. AD 65–80", "Contend for the faith against false teachers.", "shield", "Jude 1:24"],
    ["Revelation", "rev", "John the apostle", "c. AD 95", "Visions of the risen Jesus, his victory over evil, and the new heaven and earth.", "trumpet", "Revelation 21:4"]
  ];

  // Prophets: when they spoke and to whom (book index → [when, audience])
  G.PROPHET_TIME = {
    "Jonah": ["before", "Nations (Nineveh)"], "Amos": ["before", "Israel (north)"], "Hosea": ["before", "Israel (north)"],
    "Isaiah": ["before", "Judah (south)"], "Micah": ["before", "Judah (south)"], "Nahum": ["before", "Nations (Nineveh)"],
    "Zephaniah": ["before", "Judah (south)"], "Habakkuk": ["before", "Judah (south)"], "Jeremiah": ["before", "Judah (south)"],
    "Joel": ["before", "Judah (south)", "date debated"], "Obadiah": ["during", "Nations (Edom)", "date debated"],
    "Lamentations": ["during", "Judah (south)"], "Ezekiel": ["during", "Exiles in Babylon"], "Daniel": ["during", "Exiles in Babylon"],
    "Haggai": ["after", "Returned exiles"], "Zechariah": ["after", "Returned exiles"], "Malachi": ["after", "Returned exiles"]
  };
  G.AUD_C = { "Israel (north)": "#3A6E9C", "Judah (south)": "#B44664", "Nations (Nineveh)": "#5D7F2E", "Nations (Edom)": "#5D7F2E", "Exiles in Babylon": "#8E4FA3", "Returned exiles": "#B9822A" };

  // 12 eras of the story
  G.ERAS = [
    { n: "Creation & beginnings", y: "Undated", c: "#5D7F2E", ic: ["sun", "ark"], s: "God makes everything good. Adam and Eve fall, sin spreads, the flood, and the tower of Babel.", who: ["Adam", "Eve", "Noah"], books: "Genesis 1–11", ref: "Genesis 1:1" },
    { n: "The patriarchs", y: "c. 2100–1800 BC", c: "#B9822A", ic: ["tent", "star"], s: "God calls Abraham and promises land, a nation and blessing for the world, passed to Isaac, Jacob and Joseph.", who: ["Abraham", "Sarah", "Isaac", "Jacob", "Joseph"], books: "Genesis 12–50, Job", ref: "Genesis 12:1" },
    { n: "Exodus & wilderness", y: "c. 1446–1406 BC", c: "#C0603A", ic: ["tablets", "staff"], s: "Moses leads Israel out of slavery in Egypt. God gives the Law at Sinai, then 40 years in the wilderness.", who: ["Moses", "Aaron", "Miriam"], books: "Exodus – Deuteronomy", ref: "Exodus 3:10" },
    { n: "Conquest of Canaan", y: "c. 1406–1375 BC", c: "#8A6A2B", ic: ["wall", "trumpet"], s: "Joshua leads Israel across the Jordan. Jericho falls and the tribes receive the promised land.", who: ["Joshua", "Rahab", "Caleb"], books: "Joshua", ref: "Joshua 1:2" },
    { n: "The judges", y: "c. 1375–1050 BC", c: "#2A6F8A", ic: ["sword", "wheat"], s: "No king in Israel. A cycle of sin, oppression and rescue through judges. Ruth's story happens here.", who: ["Deborah", "Gideon", "Samson", "Ruth", "Samuel"], books: "Judges, Ruth, 1 Samuel 1–7", ref: "Judges 2:16" },
    { n: "United kingdom", y: "c. 1050–931 BC", c: "#8E4FA3", ic: ["crown", "harp"], s: "Israel's first three kings: Saul, David and Solomon. God promises David an everlasting throne. The Temple is built.", who: ["Saul", "David", "Solomon"], books: "1 Samuel 8 – 1 Kings 11, Psalms, Proverbs, Ecclesiastes, Song", ref: "2 Samuel 7:16" },
    { n: "Divided kingdom", y: "931–586 BC", c: "#B44664", ic: ["flame", "crown"], s: "The kingdom splits: Israel (north) and Judah (south). Prophets warn both. Assyria takes Israel (722 BC).", who: ["Elijah", "Elisha", "Isaiah", "Hezekiah", "Josiah", "Jeremiah"], books: "1 Kings 12 – 2 Kings 25, most prophets", ref: "1 Kings 12:16" },
    { n: "Exile in Babylon", y: "605/586–538 BC", c: "#6B4E8A", ic: ["ziggurat", "lion"], s: "Babylon destroys Jerusalem and the Temple. God's people live in exile, but God is still with them.", who: ["Daniel", "Ezekiel"], books: "Daniel, Ezekiel, Lamentations", ref: "Daniel 1:1" },
    { n: "Return & rebuild", y: "538–c. 430 BC", c: "#C9822B", ic: ["temple", "wall"], s: "Persia lets the Jews go home. They rebuild the Temple and Jerusalem's walls. The Old Testament closes.", who: ["Ezra", "Nehemiah", "Esther"], books: "Ezra, Nehemiah, Esther, Haggai, Zechariah, Malachi", ref: "Ezra 1:3" },
    { n: "Between the testaments", y: "c. 430–5 BC", c: "#7A7368", ic: ["hourglass", "scroll"], s: "About 400 years with no new Scripture. Greece, then Rome, rules. Synagogues, Pharisees and the Septuagint appear.", who: [], books: "No books (look up: Maccabees, Alexander the Great)", ref: "Malachi 4:5" },
    { n: "Life of Jesus", y: "c. 5 BC – AD 30/33", c: "#2E8A6C", ic: ["cross", "fish"], s: "God becomes man. Jesus teaches, heals, dies for sin and rises again on the third day.", who: ["Mary", "John the Baptist", "Jesus", "Peter"], books: "Matthew, Mark, Luke, John", ref: "John 1:14" },
    { n: "The early church", y: "AD 30–95", c: "#3A6E9C", ic: ["flame", "boat"], s: "The Holy Spirit comes at Pentecost. The gospel spreads to the nations. Letters are written to the churches.", who: ["Peter", "Paul", "Stephen", "Barnabas", "Timothy"], books: "Acts, the letters, Revelation", ref: "Acts 2:4" }
  ];

  // People: [name, roles, era index, one line, key ref, icon]
  G.PEOPLE = [
    ["Adam", ["First people"], 0, "The first man, made from dust in God's image.", "Genesis 2:7", "person"],
    ["Eve", ["First people"], 0, "The first woman, 'mother of all living'. Deceived by the serpent.", "Genesis 3:20", "apple"],
    ["Noah", ["Righteous man"], 0, "Built the ark; God's covenant with him is signed by the rainbow.", "Genesis 6:8", "ark"],
    ["Abraham", ["Patriarch"], 1, "Father of faith. God promised his descendants would be like the stars.", "Genesis 15:6", "star"],
    ["Sarah", ["Matriarch"], 1, "Abraham's wife; had Isaac at 90, laughing at the promise.", "Genesis 21:6", "tent"],
    ["Isaac", ["Patriarch"], 1, "The son of promise, nearly offered on Mount Moriah.", "Genesis 22:8", "sheep"],
    ["Jacob", ["Patriarch"], 1, "Wrestled with God and was renamed Israel. Father of the 12 tribes.", "Genesis 32:28", "ladder"],
    ["Joseph", ["Patriarch", "Leader"], 1, "Sold by his brothers, raised to rule Egypt. 'God meant it unto good.'", "Genesis 50:20", "wheat"],
    ["Moses", ["Prophet", "Leader", "Writer"], 2, "Led Israel out of Egypt and received the Law on Mount Sinai.", "Exodus 3:14", "tablets"],
    ["Aaron", ["Priest"], 2, "Moses' brother and Israel's first high priest.", "Exodus 28:1", "flame"],
    ["Miriam", ["Prophet"], 2, "Moses' sister; led the women in song after the Red Sea.", "Exodus 15:20", "harp"],
    ["Joshua", ["Leader"], 3, "Moses' successor; led the conquest of Canaan. 'Be strong and of a good courage.'", "Joshua 1:9", "wall"],
    ["Rahab", ["Woman of faith"], 3, "Hid the spies in Jericho; in Jesus' family line.", "Joshua 2:11", "door"],
    ["Caleb", ["Leader"], 3, "One of two faithful spies; took his mountain at 85.", "Joshua 14:12", "mountain"],
    ["Deborah", ["Judge", "Prophet"], 4, "Judged Israel under a palm tree and led them to victory.", "Judges 4:4", "tree"],
    ["Gideon", ["Judge"], 4, "Defeated Midian with 300 men, trumpets and torches.", "Judges 7:20", "trumpet"],
    ["Samson", ["Judge"], 4, "Strong man with a weakness; died defeating the Philistines.", "Judges 16:28", "lion"],
    ["Ruth", ["Woman of faith"], 4, "Moabite widow; great-grandmother of King David.", "Ruth 1:16", "wheat"],
    ["Samuel", ["Prophet", "Judge", "Priest"], 4, "Last judge; anointed Israel's first two kings.", "1 Samuel 3:10", "lamp"],
    ["Saul", ["King"], 5, "Israel's first king; started well, ended in disobedience.", "1 Samuel 15:22", "crown"],
    ["David", ["King", "Writer"], 5, "Shepherd, giant-slayer, psalmist, 'a man after God's own heart'.", "1 Samuel 16:7", "harp"],
    ["Solomon", ["King", "Writer"], 5, "Asked for wisdom; built the Temple; drifted later in life.", "1 Kings 3:9", "temple"],
    ["Elijah", ["Prophet"], 6, "Fire from heaven on Mount Carmel; taken up in a whirlwind.", "1 Kings 18:38", "flame"],
    ["Elisha", ["Prophet"], 6, "Received a double portion of Elijah's spirit; many miracles.", "2 Kings 2:9", "staff"],
    ["Isaiah", ["Prophet", "Writer"], 6, "Saw the Lord high and lifted up; foretold the suffering servant.", "Isaiah 6:8", "flame"],
    ["Hezekiah", ["King"], 6, "Good king of Judah; trusted God when Assyria surrounded Jerusalem.", "2 Kings 18:5", "shield"],
    ["Josiah", ["King"], 6, "Became king at 8; found the lost Book of the Law and led reform.", "2 Kings 22:2", "scroll"],
    ["Jeremiah", ["Prophet", "Writer"], 6, "The weeping prophet; warned Judah for 40 years, thrown in a cistern.", "Jeremiah 1:5", "well"],
    ["Jonah", ["Prophet"], 6, "Ran from God, swallowed by a great fish, preached to Nineveh.", "Jonah 1:17", "fish"],
    ["Daniel", ["Prophet", "Writer"], 7, "Faithful in Babylon; survived the lions' den.", "Daniel 6:22", "lion"],
    ["Ezekiel", ["Prophet", "Priest", "Writer"], 7, "Prophet to the exiles; saw the valley of dry bones.", "Ezekiel 37:4", "eye"],
    ["Esther", ["Queen"], 8, "Jewish queen of Persia who saved her people.", "Esther 4:14", "crown"],
    ["Ezra", ["Priest", "Writer"], 8, "Scribe who taught God's Law to the returned exiles.", "Ezra 7:10", "book"],
    ["Nehemiah", ["Leader", "Writer"], 8, "Cupbearer to the Persian king; rebuilt Jerusalem's walls.", "Nehemiah 6:15", "wall"],
    ["Mary", ["Woman of faith"], 10, "The virgin mother of Jesus. 'Be it unto me according to thy word.'", "Luke 1:38", "star"],
    ["John the Baptist", ["Prophet"], 10, "Prepared the way; 'Behold the Lamb of God'.", "John 1:29", "sheep"],
    ["Jesus", ["Son of God", "Messiah"], 10, "God the Son made flesh, crucified and risen.", "John 1:14", "cross"],
    ["Mary Magdalene", ["Disciple"], 10, "First to see the risen Jesus.", "John 20:16", "tomb"],
    ["Peter", ["Apostle", "Writer"], 10, "Fisherman, leader of the Twelve; denied Jesus, restored, preached at Pentecost.", "Matthew 16:16", "key"],
    ["Andrew", ["Apostle"], 10, "Peter's brother; brought him to Jesus.", "John 1:41", "fish"],
    ["James (son of Zebedee)", ["Apostle"], 10, "One of the inner three; first apostle martyred.", "Acts 12:2", "boat"],
    ["John", ["Apostle", "Writer"], 10, "'The disciple whom Jesus loved'; wrote a Gospel, 3 letters and Revelation.", "John 13:23", "heart"],
    ["Philip", ["Apostle"], 10, "From Bethsaida; brought Nathanael to Jesus.", "John 1:43", "person"],
    ["Bartholomew (Nathanael)", ["Apostle"], 10, "'An Israelite indeed, in whom is no guile.'", "John 1:47", "tree"],
    ["Thomas", ["Apostle"], 10, "Doubted, then confessed 'My Lord and my God'.", "John 20:28", "eye"],
    ["Matthew (Levi)", ["Apostle", "Writer"], 10, "Tax collector who left everything to follow Jesus.", "Matthew 9:9", "coins"],
    ["James (son of Alphaeus)", ["Apostle"], 10, "Listed among the Twelve; little else is recorded.", "Matthew 10:3", "person"],
    ["Thaddaeus (Judas son of James)", ["Apostle"], 10, "Asked Jesus a question at the Last Supper.", "John 14:22", "person"],
    ["Simon the Zealot", ["Apostle"], 10, "Once part of (or nicknamed after) a zealous movement.", "Luke 6:15", "sword"],
    ["Judas Iscariot", ["Apostle"], 10, "Betrayed Jesus for 30 pieces of silver.", "Matthew 26:15", "coins"],
    ["Matthias", ["Apostle"], 11, "Chosen to replace Judas.", "Acts 1:26", "person"],
    ["Stephen", ["Deacon"], 11, "First Christian martyr; saw Jesus standing at God's right hand.", "Acts 7:56", "star"],
    ["Paul", ["Apostle", "Writer"], 11, "Persecutor turned apostle to the Gentiles; wrote 13 letters.", "Acts 9:15", "letter"],
    ["Barnabas", ["Missionary"], 11, "'Son of encouragement'; Paul's first mission partner.", "Acts 4:36", "heart"],
    ["Timothy", ["Pastor"], 11, "Paul's 'son in the faith'; pastor in Ephesus.", "2 Timothy 1:5", "staff"]
  ];
  G.ROLE_C = { "Patriarch": "#B9822A", "Matriarch": "#B9822A", "Prophet": "#B44664", "Judge": "#2A6F8A", "King": "#8E4FA3", "Queen": "#8E4FA3", "Priest": "#C0603A", "Apostle": "#2E8A6C", "Leader": "#5D7F2E", "Writer": "#3A6E9C" };

  G.COVENANTS = [
    { n: "Noah", sign: "Rainbow", p: "God will never again destroy the earth by flood.", ref: "Genesis 9:11", ic: "rainbow", c: "#2A6F8A" },
    { n: "Abraham", sign: "Circumcision", p: "Land, descendants like the stars, and blessing for all nations.", ref: "Genesis 12:3", ic: "star", c: "#B9822A" },
    { n: "Moses (Sinai)", sign: "Sabbath", p: "Israel will be God's treasured people if they keep his Law.", ref: "Exodus 19:5", ic: "tablets", c: "#C0603A" },
    { n: "David", sign: "A son on the throne", p: "David's throne and kingdom will last forever, fulfilled in Jesus.", ref: "2 Samuel 7:16", ic: "crown", c: "#8E4FA3" },
    { n: "The new covenant", sign: "The Lord's Supper", p: "God's law written on hearts, sins forgiven, through Jesus' blood.", ref: "Jeremiah 31:33", ic: "cup", c: "#2E8A6C" }
  ];

  // Anchor verses: [ref, topic, someone says…, picture hook]
  G.VERSES = [
    ["John 3:16", "The gospel in one verse", "Why did Jesus come?", "heart"],
    ["Romans 3:23", "Everyone has sinned", "I'm a good person, I don't need saving.", "person"],
    ["Romans 6:23", "Sin's wage, God's gift", "What's the big deal about sin?", "gift"],
    ["Ephesians 2:8-9", "Saved by grace, not works", "I have to earn my way to God.", "key"],
    ["John 14:6", "Jesus is the way", "All roads lead to God.", "door"],
    ["2 Timothy 3:16", "Scripture is God-breathed", "The Bible is just words written by men.", "scroll"],
    ["John 10:27", "Hearing God's voice", "How do you even hear God?", "ear"],
    ["1 Corinthians 10:13", "A way out of temptation", "I just can't resist it.", "shield"],
    ["James 1:13", "God doesn't tempt us", "God is testing me with this sin.", "apple"],
    ["Philippians 4:6-7", "Prayer instead of anxiety", "I'm so stressed and worried.", "dove"],
    ["Romans 8:28", "God works all things for good", "Why is this happening to me?", "anchor"],
    ["Romans 8:38-39", "Nothing can separate us", "God couldn't love me after what I've done.", "heart"],
    ["Hebrews 4:12", "The Word is alive", "The Bible is old and irrelevant.", "sword"],
    ["John 1:1", "Jesus is the Word, and is God", "Jesus never claimed to be God.", "book"],
    ["John 1:14", "God became flesh", "How could God become a man?", "tent"],
    ["Colossians 2:9", "All of God in Jesus", "Jesus was just a good teacher.", "crown"],
    ["Matthew 28:19", "Father, Son and Holy Spirit", "The Trinity isn't in the Bible.", "globe"],
    ["1 John 1:9", "Confess and be forgiven", "I keep messing up. Will God forgive me again?", "sun"],
    ["Matthew 6:14-15", "Forgive others", "I can't forgive them for what they did.", "heart"],
    ["Proverbs 3:5-6", "Trust God's direction", "I don't know which way to go.", "staff"],
    ["Psalms 119:105", "God's Word lights the path", "Why should I read the Bible every day?", "lamp"],
    ["Jeremiah 29:11", "God's plans (spoken to exiles)", "Does God have a plan for me?", "star"],
    ["Isaiah 53:5", "The cross foretold", "The Old Testament has nothing to do with Jesus.", "cross"],
    ["Micah 5:2", "Born in Bethlehem, foretold", "Prophecies are vague guesses.", "star"],
    ["1 Corinthians 15:3-4", "The core of the gospel", "What actually is the gospel?", "tomb"],
    ["John 11:25", "The resurrection and the life", "What happens when we die?", "tomb"],
    ["2 Corinthians 5:8", "With the Lord at death", "Do we just sleep until the end?", "cloud"],
    ["Revelation 21:4", "No more tears", "What will heaven be like?", "sun"],
    ["John 14:2", "A place prepared", "Is heaven real?", "door"],
    ["Galatians 5:22-23", "Fruit of the Spirit", "How do I know the Spirit is in me?", "tree"],
    ["Romans 10:9", "Confess and believe", "How do I become a Christian?", "bubble"],
    ["Hebrews 11:1", "What faith is", "Faith is just blind belief.", "anchor"],
    ["James 2:17", "Real faith works", "It doesn't matter how I live if I believe.", "seed"],
    ["1 Peter 3:15", "Be ready to explain your hope", "Why do you even believe this?", "bubble"],
    ["Matthew 6:33", "Seek God's kingdom first", "I need to sort my life out first.", "crown"],
    ["1 Timothy 6:10", "The love of money", "Money is the root of all evil.", "coins"],
    ["Joshua 1:9", "Be strong and courageous", "I'm scared to step out.", "sword"],
    ["Isaiah 40:31", "Strength renewed", "I'm exhausted. I can't keep going.", "mountain"],
    ["Psalms 23:1", "The Lord is my shepherd", "I feel alone and lacking.", "sheep"],
    ["2 Corinthians 5:17", "A new creation", "I can't change who I am.", "seed"]
  ];

  // Topics. b = branches: [label, refs] or [label, null, look-up note]
  G.TOPICS = [
    { id: "heaven", g: "q", t: "What does the Bible say about heaven?", ic: "sun", b: [
      ["Jesus prepares a place", "John 14:2-3"], ["With the Lord at death", "2 Corinthians 5:8; Philippians 1:23; Luke 23:43"],
      ["No more tears or pain", "Revelation 21:3-4"], ["New heaven & new earth", "Revelation 21:1; Isaiah 65:17"],
      ["New resurrection bodies", "1 Corinthians 15:42-44; Philippians 3:20-21"], ["Seeing God face to face", "Revelation 22:3-5; 1 Corinthians 13:12"]] },
    { id: "trust", g: "q", t: "How do we know we can trust the Bible?", ic: "scroll", b: [
      ["Breathed out by God", "2 Timothy 3:16; 2 Peter 1:20-21"], ["Fulfilled prophecy", "Micah 5:2; Isaiah 53:5; Luke 24:44"],
      ["Eyewitness accounts", "Luke 1:1-4; 1 John 1:1-3; 2 Peter 1:16"], ["Jesus trusted Scripture", "Matthew 5:17-18; John 10:35"],
      ["It stands forever", "Isaiah 40:8; Matthew 24:35"], ["Look up: manuscripts", null, "Dead Sea Scrolls (found 1947) and the thousands of Greek New Testament manuscripts. Compare how many copies exist of other ancient books."]] },
    { id: "canon", g: "q", t: "How did the Bible come together?", ic: "book", b: [
      ["Law, Prophets & Writings", "Luke 24:44"], ["Jesus' Old Testament: Abel to Zechariah", "Matthew 23:35"],
      ["Apostles' letters called Scripture", "2 Peter 3:15-16; 1 Timothy 5:18"], ["Written to be read in churches", "Colossians 4:16; 1 Thessalonians 5:27"],
      ["Look up: who and when", null, "About 40 writers over about 1,500 years, in Hebrew, Aramaic and Greek."],
      ["Look up: the 27 NT books", null, "Athanasius' Easter letter (AD 367) and the Council of Carthage (AD 397) recognised the 27 books the churches already used."]] },
    { id: "voice", g: "q", t: "How do we hear God's voice?", ic: "ear", b: [
      ["Mainly through Scripture", "2 Timothy 3:16-17; Psalms 119:105"], ["My sheep hear my voice", "John 10:27"],
      ["The Spirit guides into truth", "John 16:13; Romans 8:14"], ["A still small voice", "1 Kings 19:11-12"],
      ["Test everything", "1 John 4:1; 1 Thessalonians 5:21"], ["Wise counsel & peace", "Proverbs 11:14; Colossians 3:15"]] },
    { id: "temptation", g: "q", t: "What do I do with temptation?", ic: "apple", b: [
      ["God always gives a way out", "1 Corinthians 10:13"], ["God doesn't tempt us; desire does", "James 1:13-15"],
      ["Jesus fought with Scripture", "Matthew 4:1-11"], ["Flee", "2 Timothy 2:22; Genesis 39:12"],
      ["Watch and pray", "Matthew 26:41"], ["Jesus understands", "Hebrews 4:15-16"]] },
    { id: "resurrection", g: "q", t: "Did Jesus really rise from the dead?", ic: "tomb", b: [
      ["The empty tomb", "Matthew 28:1-10; John 20:1-10"], ["Seen by more than 500", "1 Corinthians 15:3-8"],
      ["Predicted beforehand", "Mark 8:31; Psalms 16:10; Acts 2:31"], ["Scared men made bold", "Acts 4:13-20"],
      ["If Christ is not raised…", "1 Corinthians 15:14-20"], ["Our resurrection too", "1 Corinthians 15:20-23"]] },
    { id: "study", g: "q", t: "How do I study the Bible well?", ic: "lamp", b: [
      ["All Scripture is useful", "2 Timothy 3:16-17"], ["Handle it rightly", "2 Timothy 2:15"],
      ["Check it like the Bereans", "Acts 17:11"], ["Meditate day and night", "Psalms 1:2; Joshua 1:8"],
      ["Do what it says", "James 1:22"], ["Look up: a method", null, "Ask: what kind of writing is it? Who wrote it, to whom, when? What does it say about God? How do I respond? (e.g. the SOAP method)"]] },
    { id: "death", g: "q", t: "What happens when we die?", ic: "cloud", b: [
      ["Spirit returns to God", "Ecclesiastes 12:7"], ["'Today in paradise'", "Luke 23:43"],
      ["Absent from body, present with the Lord", "2 Corinthians 5:8"], ["The rich man & Lazarus", "Luke 16:19-31"],
      ["Bodies raised one day", "John 5:28-29; 1 Thessalonians 4:16-17"], ["Then judgment", "Hebrews 9:27"]] },
    { id: "hell", g: "q", t: "What does the Bible say about hell?", ic: "flame", b: [
      ["Jesus warned about it", "Matthew 10:28; Mark 9:43-48"], ["Separated from God", "2 Thessalonians 1:9"],
      ["Outer darkness", "Matthew 25:30; Matthew 25:41; Matthew 25:46"], ["The lake of fire", "Revelation 20:14-15"],
      ["God wants none to perish", "2 Peter 3:9; Ezekiel 33:11"], ["Look up: views", null, "Christians differ (eternal conscious punishment vs. annihilation). Compare the passages yourself."]] },
    { id: "suffering", g: "q", t: "Why does God allow suffering?", ic: "cloud", b: [
      ["A broken, fallen world", "Genesis 3:17-19; Romans 8:20-22"], ["Job's story", "Job 1:21; Job 38:4; Job 42:5"],
      ["God brings good from evil", "Genesis 50:20; Romans 8:28"], ["Suffering grows us", "James 1:2-4; Romans 5:3-5"],
      ["Jesus suffered too", "Isaiah 53:3; Hebrews 2:18"], ["It will end", "Revelation 21:4"]] },
    { id: "secure", g: "q", t: "Can you lose your salvation?", ic: "anchor", b: [
      ["No one can snatch them", "John 10:28-29"], ["Sealed by the Spirit", "Ephesians 1:13-14"],
      ["Nothing separates us", "Romans 8:38-39"], ["He will finish what he started", "Philippians 1:6"],
      ["The warning passages", "Hebrews 6:4-6; Hebrews 10:26-27"], ["Examine yourselves", "2 Corinthians 13:5"]] },
    { id: "faithworks", g: "q", t: "Faith vs works: do Paul and James disagree?", ic: "seed", b: [
      ["Justified by faith", "Romans 3:28; Galatians 2:16"], ["Abraham believed God", "Genesis 15:6; Romans 4:3"],
      ["Faith without works is dead", "James 2:17; James 2:24; James 2:26"], ["Created for good works", "Ephesians 2:10"],
      ["Faith working through love", "Galatians 5:6"]] },
    { id: "spirit", g: "q", t: "The Holy Spirit & spiritual gifts", ic: "dove", b: [
      ["The promised Helper", "John 14:16-17; John 14:26"], ["Pentecost", "Acts 2:1-4"],
      ["Fruit of the Spirit", "Galatians 5:22-23"], ["Gifts for the body", "1 Corinthians 12:4-11; Romans 12:6-8"],
      ["Sealed and guaranteed", "Ephesians 1:13-14"], ["Don't grieve the Spirit", "Ephesians 4:30"]] },
    { id: "prayer", g: "q", t: "Prayer: does it change things?", ic: "dove", b: [
      ["The Lord's Prayer", "Matthew 6:9-13"], ["Ask, seek, knock", "Matthew 7:7-11"],
      ["Pray without ceasing", "1 Thessalonians 5:17"], ["Prayer is powerful", "James 5:16-18"],
      ["The Spirit helps us pray", "Romans 8:26"], ["Thy will be done", "Luke 22:42; 1 John 5:14"]] },
    { id: "forgive", g: "q", t: "Forgiveness: of others and yourself", ic: "heart", b: [
      ["Forgive as you were forgiven", "Ephesians 4:32; Colossians 3:13"], ["Seventy times seven", "Matthew 18:21-35"],
      ["Forgive to be forgiven", "Matthew 6:14-15"], ["God removes our sin", "Psalms 103:12; Isaiah 43:25"],
      ["Confess and be cleansed", "1 John 1:9"], ["'Father, forgive them'", "Luke 23:34"]] },
    { id: "anxiety", g: "q", t: "Anxiety and worry", ic: "dove", b: [
      ["Don't worry about tomorrow", "Matthew 6:25-34"], ["Pray, and peace guards you", "Philippians 4:6-7"],
      ["Cast your cares on him", "1 Peter 5:7"], ["Jesus gives peace", "John 14:27"],
      ["Fear not, I am with you", "Isaiah 41:10"], ["Take thoughts captive", "2 Corinthians 10:5"]] },
    { id: "money", g: "q", t: "Money and generosity", ic: "coins", b: [
      ["The love of money", "1 Timothy 6:6-10"], ["Treasure in heaven", "Matthew 6:19-21; Matthew 6:24"],
      ["A cheerful giver", "2 Corinthians 9:6-7"], ["The tithe", "Malachi 3:10; Genesis 14:20"],
      ["Contentment", "Philippians 4:11-13; Hebrews 13:5"], ["Work hard", "2 Thessalonians 3:10; Proverbs 6:6"]] },
    { id: "relationships", g: "q", t: "Marriage, singleness & relationships", ic: "rings", b: [
      ["One flesh", "Genesis 2:24; Matthew 19:4-6"], ["Husbands and wives", "Ephesians 5:21-33"],
      ["What love is", "1 Corinthians 13:4-7"], ["Singleness as a gift", "1 Corinthians 7:7-8; 1 Corinthians 7:32-35"],
      ["Unequally yoked", "2 Corinthians 6:14"], ["True friends", "Proverbs 17:17; Proverbs 27:17"]] },
    { id: "law", g: "q", t: "Which Old Testament laws still apply?", ic: "tablets", b: [
      ["Jesus fulfilled the Law", "Matthew 5:17-18"], ["A shadow of what was coming", "Colossians 2:16-17; Hebrews 10:1"],
      ["The Jerusalem council", "Acts 15:28-29"], ["All foods clean", "Mark 7:19; Acts 10:15"],
      ["Love fulfils the Law", "Romans 13:8-10; Matthew 22:37-40"], ["Under grace", "Romans 6:14; Galatians 3:24-25"]] },
    { id: "prophecy", g: "q", t: "Prophecies Jesus fulfilled", ic: "star", b: [
      ["Born of a virgin", "Isaiah 7:14; Matthew 1:23"], ["Born in Bethlehem", "Micah 5:2; Matthew 2:6"],
      ["King on a donkey", "Zechariah 9:9; Matthew 21:5"], ["Hands and feet pierced", "Psalms 22:16; John 19:37"],
      ["The suffering servant", "Isaiah 53:5; Acts 8:32-35"], ["Not a bone broken", "Psalms 34:20; John 19:36"]] },
    { id: "creation", g: "q", t: "Creation & Genesis 1–11", ic: "sun", b: [
      ["In the beginning", "Genesis 1:1; John 1:1-3"], ["Made in God's image", "Genesis 1:26-27"],
      ["God rested", "Genesis 2:2-3; Exodus 20:11"], ["The Fall", "Genesis 3:6"],
      ["The flood", "Genesis 6:13; Matthew 24:37-39"], ["Babel", "Genesis 11:1-9"],
      ["Look up: views", null, "Christians differ on the age of the earth and the days of Genesis 1 (young-earth, old-earth, framework). All agree God created."]] },
    { id: "warfare", g: "q", t: "Angels, demons & spiritual warfare", ic: "shield", b: [
      ["The armour of God", "Ephesians 6:10-18"], ["The devil prowls", "1 Peter 5:8-9"],
      ["Resist him and he flees", "James 4:7"], ["Angels serve believers", "Hebrews 1:14; Psalms 91:11"],
      ["Jesus disarmed the powers", "Colossians 2:15; 1 John 3:8"], ["Disguised as light", "2 Corinthians 11:14"]] },
    { id: "endtimes", g: "q", t: "End times & Revelation", ic: "trumpet", b: [
      ["Jesus will return", "Acts 1:11; John 14:3"], ["No one knows the hour", "Matthew 24:36"],
      ["Signs of the end", "Matthew 24:3-14"], ["Caught up together", "1 Thessalonians 4:16-17"],
      ["The thousand years", "Revelation 20:1-6"], ["All things made new", "Revelation 21:5; 2 Peter 3:13"],
      ["Look up: views", null, "Christians differ on the millennium (pre-, post-, a-millennial) and the rapture. Learn what each view says."]] },
    { id: "identity", g: "q", t: "Who am I in Christ?", ic: "seed", b: [
      ["A new creation", "2 Corinthians 5:17"], ["A child of God", "John 1:12; 1 John 3:1"],
      ["Chosen", "Ephesians 1:4-5; 1 Peter 2:9"], ["No condemnation", "Romans 8:1"],
      ["God's workmanship", "Ephesians 2:10"], ["Christ lives in me", "Galatians 2:20"]] },
    { id: "apologetics", g: "q", t: "Answering tough questions about faith", ic: "bubble", b: [
      ["Always be ready", "1 Peter 3:15"], ["Paul at Athens", "Acts 17:22-31"],
      ["Creation points to God", "Romans 1:20; Psalms 19:1"], ["Resurrection evidence", "1 Corinthians 15:3-8"],
      ["Written so you may believe", "Luke 1:1-4; John 20:30-31"], ["With gentleness", "Colossians 4:6; 2 Timothy 2:24-25"]] },
    // Theology track: one a week
    { id: "th-god", g: "th", t: "Who is God? (his attributes)", ic: "sun", b: [
      ["Holy", "Isaiah 6:3"], ["Eternal", "Psalms 90:2"], ["All-knowing", "Psalms 139:1-6"],
      ["All-powerful", "Jeremiah 32:17"], ["Unchanging", "Malachi 3:6; James 1:17"], ["Love", "1 John 4:8"]] },
    { id: "th-trinity", g: "th", t: "The Trinity: is it in the Bible?", ic: "globe", b: [
      ["One God", "Deuteronomy 6:4"], ["Father, Son and Spirit named together", "Matthew 28:19; 2 Corinthians 13:14"],
      ["At Jesus' baptism", "Matthew 3:16-17"], ["The Son is God", "John 1:1; Hebrews 1:8"], ["The Spirit is God", "Acts 5:3-4"]] },
    { id: "th-jesus", g: "th", t: "Jesus: fully God, fully man", ic: "cross", b: [
      ["The Word was God", "John 1:1; John 1:14"], ["'Before Abraham was, I am'", "John 8:58; Exodus 3:14"],
      ["'My Lord and my God'", "John 20:28"], ["All the fulness of God", "Colossians 2:9"],
      ["He forgives sins", "Mark 2:5-7"], ["Tempted like us, without sin", "Hebrews 4:15; Philippians 2:5-8"]] },
    { id: "th-spirit", g: "th", t: "The Holy Spirit", ic: "dove", b: [
      ["A person, not a force", "John 16:13; Ephesians 4:30"], ["Is God", "Acts 5:3-4"],
      ["Lives in believers", "1 Corinthians 6:19"], ["Gives new birth", "John 3:5-8; Titus 3:5"]] },
    { id: "th-sin", g: "th", t: "Sin and the Fall", ic: "apple", b: [
      ["The first sin", "Genesis 3:6"], ["Through one man", "Romans 5:12"], ["All have sinned", "Romans 3:23"],
      ["The heart is deceitful", "Jeremiah 17:9"], ["Sin separates", "Isaiah 59:2"], ["Sin's wages", "Romans 6:23"]] },
    { id: "th-grace", g: "th", t: "Salvation by grace through faith", ic: "gift", b: [
      ["By grace, through faith", "Ephesians 2:8-9"], ["Not by our works", "Titus 3:5"],
      ["Confess and believe", "Romans 10:9-10"], ["God so loved", "John 3:16"], ["No other name", "Acts 4:12"]] },
    { id: "th-cross", g: "th", t: "The cross: why did Jesus have to die?", ic: "cross", b: [
      ["Wounded for us", "Isaiah 53:5-6"], ["Made sin for us", "2 Corinthians 5:21"], ["Bore our sins", "1 Peter 2:24"],
      ["A ransom for many", "Mark 10:45"], ["No forgiveness without blood", "Hebrews 9:22"], ["Propitiation", "Romans 3:25"]] },
    { id: "th-justify", g: "th", t: "Justification vs sanctification", ic: "tree", b: [
      ["Declared right (justified)", "Romans 5:1"], ["The golden chain", "Romans 8:30"],
      ["Being made holy (sanctified)", "1 Thessalonians 4:3"], ["Work out what God works in", "Philippians 2:12-13"],
      ["Changed from glory to glory", "2 Corinthians 3:18"]] },
    { id: "th-word", g: "th", t: "Scripture: God's Word", ic: "scroll", b: [
      ["God-breathed", "2 Timothy 3:16"], ["Men moved by the Spirit", "2 Peter 1:21"],
      ["Perfect, sure, right", "Psalms 19:7-11"], ["Living and sharp", "Hebrews 4:12"], ["It won't return empty", "Isaiah 55:11"]] },
    { id: "th-church", g: "th", t: "The church", ic: "temple", b: [
      ["Jesus builds it", "Matthew 16:18"], ["One body, many parts", "1 Corinthians 12:12-27"],
      ["The first church", "Acts 2:42-47"], ["Equipped to grow", "Ephesians 4:11-16"], ["Don't stop meeting", "Hebrews 10:24-25"]] },
    { id: "th-sacraments", g: "th", t: "Baptism and communion", ic: "cup", b: [
      ["Go and baptise", "Matthew 28:19"], ["Repent and be baptised", "Acts 2:38"], ["Buried and raised with him", "Romans 6:3-4"],
      ["'This do in remembrance of me'", "Luke 22:19-20"], ["Proclaim his death", "1 Corinthians 11:23-26"]] },
    { id: "th-covenant", g: "th", t: "Law, grace and the new covenant", ic: "rainbow", b: [
      ["A new covenant promised", "Jeremiah 31:31-34"], ["In Jesus' blood", "Luke 22:20"],
      ["A better covenant", "Hebrews 8:6-13"], ["The Law was a tutor", "Galatians 3:24-25"], ["Not under law but grace", "Romans 6:14"]] }
  ];

  // Chronological reading path: [label, open ref]
  G.PATH = [
    ["Genesis 1–11", "Genesis 1"], ["Job 1–21", "Job 1"], ["Job 22–42", "Job 22"], ["Genesis 12–25", "Genesis 12"], ["Genesis 26–36", "Genesis 26"], ["Genesis 37–50", "Genesis 37"],
    ["Exodus 1–18", "Exodus 1"], ["Exodus 19–40", "Exodus 19"], ["Leviticus 1–14", "Leviticus 1"], ["Leviticus 15–27", "Leviticus 15"], ["Numbers 1–14", "Numbers 1"], ["Numbers 15–36", "Numbers 15"],
    ["Deuteronomy 1–17", "Deuteronomy 1"], ["Deuteronomy 18–34 + Psalm 90", "Deuteronomy 18"], ["Joshua 1–12", "Joshua 1"], ["Joshua 13–24", "Joshua 13"], ["Judges 1–12", "Judges 1"], ["Judges 13–21", "Judges 13"],
    ["Ruth", "Ruth 1"], ["1 Samuel 1–15", "1 Samuel 1"], ["1 Samuel 16–31", "1 Samuel 16"], ["2 Samuel 1–12 + Psalm 51", "2 Samuel 1"], ["2 Samuel 13–24", "2 Samuel 13"], ["Psalms 1–41", "Psalms 1"],
    ["Psalms 42–89", "Psalms 42"], ["Psalms 91–150", "Psalms 91"], ["1 Chronicles 1–29", "1 Chronicles 1"], ["1 Kings 1–11", "1 Kings 1"], ["Proverbs 1–15", "Proverbs 1"], ["Proverbs 16–31", "Proverbs 16"],
    ["Song of Solomon + Ecclesiastes", "Song of Solomon 1"], ["2 Chronicles 1–9", "2 Chronicles 1"], ["1 Kings 12–22", "1 Kings 12"], ["2 Kings 1–8", "2 Kings 1"], ["Jonah + Amos", "Jonah 1"], ["Hosea", "Hosea 1"],
    ["2 Kings 9–17", "2 Kings 9"], ["Isaiah 1–39 + Micah", "Isaiah 1"], ["2 Kings 18–20", "2 Kings 18"], ["Isaiah 40–66", "Isaiah 40"], ["Nahum, Zephaniah, Habakkuk", "Nahum 1"], ["2 Kings 21–25", "2 Kings 21"],
    ["Jeremiah 1–25", "Jeremiah 1"], ["Jeremiah 26–52 + Lamentations", "Jeremiah 26"], ["Joel + Obadiah", "Joel 1"], ["2 Chronicles 10–36", "2 Chronicles 10"], ["Ezekiel 1–24", "Ezekiel 1"], ["Ezekiel 25–48", "Ezekiel 25"],
    ["Daniel", "Daniel 1"], ["Ezra 1–6, Haggai, Zechariah", "Ezra 1"], ["Esther", "Esther 1"], ["Ezra 7–10 + Nehemiah", "Ezra 7"], ["Malachi", "Malachi 1"],
    ["Matthew", "Matthew 1"], ["Mark", "Mark 1"], ["Luke", "Luke 1"], ["John", "John 1"], ["Acts 1–12", "Acts 1"], ["James", "James 1"], ["Acts 13–15 + Galatians", "Acts 13"],
    ["Acts 16–18 + 1 & 2 Thessalonians", "Acts 16"], ["Acts 19–20 + 1 & 2 Corinthians", "Acts 19"], ["Romans", "Romans 1"], ["Acts 21–28", "Acts 21"], ["Ephesians, Philippians, Colossians, Philemon", "Ephesians 1"],
    ["1 Timothy, Titus, 1 Peter", "1 Timothy 1"], ["2 Timothy, 2 Peter, Jude", "2 Timothy 1"], ["Hebrews", "Hebrews 1"], ["1, 2 & 3 John", "1 John 1"], ["Revelation", "Revelation 1"]
  ];

  // First 4 weeks: big picture
  G.ROADMAP = [
    { w: 1, t: "The 66 books", d: "Learn the 10 sections, then the books in order. Use the colour map + quiz.", go: ["basics", "books"], ic: "book" },
    { w: 2, t: "The story in 12 eras", d: "Walk the timeline. Retell the whole Bible story from memory in 2 minutes.", go: ["basics", "story"], ic: "hourglass" },
    { w: 3, t: "People & roles", d: "Patriarchs, judges, kings, prophets, apostles: who, when and what they did.", go: ["basics", "people"], ic: "person" },
    { w: 4, t: "Prophets & covenants", d: "When each prophet spoke, and the 5 covenants that hold the story together.", go: ["basics", "prophets"], ic: "rainbow" }
  ];

  G.CHECKS = [
    ["sections", "I can name the 10 sections of the Bible"], ["order-ot", "I can say the 39 OT books in order"], ["order-nt", "I can say the 27 NT books in order"],
    ["eras", "I can retell the 12 eras of the story"], ["apostles", "I can name the 12 apostles"], ["prophets", "I know which prophets came before, during and after the exile"],
    ["kings", "I know Saul, David, Solomon, then the split"], ["covenants", "I can explain the 5 covenants"]
  ];
})();
