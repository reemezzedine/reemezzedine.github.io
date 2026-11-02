/* ============================================================
   EVERYTHING YOU CAN EDIT LIVES IN THIS FILE.
   - Change any text between the quotes.
   - Photos live in /photos, stickers in /stickers.
   - To swap a photo: drop a new .webp/.jpg in /photos and change "src".
   - <br> makes a new line. Keep the commas at the ends of lines.
   ============================================================ */

window.CONTENT = {
  name: "Tatiana Azar",
  nickname: "Tatie",
  date: "2 · 11",

  /* ---------- 1. CAKE SCREEN ---------- */
  cake: {
    candles: 7,
    kicker: "2 november",           // small line above the title
    title: "happy birthday, tatie", // big title
    hint: "make a wish! ya albe ✶ then swipe across the candles",
    fallbackHint: "can't swipe? tap each flame",
    done: "kel sene w ente b5eir ♡",
    button: "open the scrapbook →",
  },

  /* ---------- 2. COVER ---------- */
  cover: {
    kicker: "a little scrapbook for",
    title: "Tatie",
    subtitle: "my forever bestie & my beautifulest smartest best friend",
    footer: "scroll slowly. touch everything.",
  },

  /* ---------- 3. SCRAPBOOK PAGES (in order) ----------
     page types: "photos", "memories", "timeline", "stats", "stickers", "note"

     In a "photos" page:
       strips  = classic photo-booth strips (3–4 photos stacked)
       photos  = single prints
     filter: "bw" (black & white), or leave it out for full colour
     style (single prints): "polaroid" or "taped"
     tilt: degrees of rotation (negative = left)
     In a strip, a photo can be { src: "...", y: 20 } to move the crop:
       y: 0 shows the top of the photo, 50 the middle, 100 the bottom */
  pages: [
    {
      type: "note",
      title: "for you",
      envelopeLabel: "tap to open · from reem",
      letter: [
        "ya albo la albe,",
        "happiest of birthdays to my beautifulest, favoritest human in the whole wide world.",
        "i miss you so much and i love you so much and i'm so proud of everything you've achieved so far.",
        "you're a literal light to the world and you have the most beautiful, most bubbly energy i've ever seen. i can only hope to watch you grow and bloom into the woman that you are.",
        "keep being amazing and insane. i love you so much.",
      ],
      signoff: "ana bel aktar,<br>reem",
    },
    {
      type: "photos",
      title: "berlin, us",
      note: "the time i finally got to hug you instead of voice-noting you",
      strips: [
        { photos: ["photos/brandenburg.webp", "photos/street-hug.webp", "photos/reichstag.webp", "photos/tram.webp"], caption: "berlin!! us!! finally!!", filter: "bw", tilt: -4 },
      ],
      photos: [
        { src: "photos/dream-donuts.webp", caption: "pink wall, black puffers, iconic", style: "polaroid", tilt: 5 },
        { src: "photos/mask-selfie.webp", caption: "masks off for the pic", style: "taped", tilt: -3 },
      ],
    },
    {
      type: "photos",
      title: "golden hour",
      note: "tiergarten. the cobblestones, the cold, that smile",
      photos: [
        { src: "photos/tiergarten-smile.webp", caption: "caught her laughing ★", style: "polaroid", tilt: 2, wide: true },
        { src: "photos/tiergarten.webp", caption: "berlin skies >>>", style: "taped", tilt: -3, wide: true },
      ],
    },
    {
      type: "memories",
      title: "our little moments",
      note: "tickets to things that live in my head rent free. tap one.",
      items: [
        {
          label: "the sticker story",
          sticker: "stickers/carebears.webp",
          back: "i lost all my whatsapp and begged you for the two monkeys hugging sticker. you looked everywhere, couldn't find it, and sent me the care bears hugging instead. it became my #2 most sent sticker. 20 times. 🥹",
        },
        {
          label: "younes",
          sticker: "stickers/kitten-suit.webp",
          back: "\"why cant we yap in person at younes. so rude\"<br><br>one day we will. same table. you yap, i yap, nobody works.",
        },
        {
          label: "laylati",
          photo: "photos/laylati-zoom.webp",
          back: "our zoom sessions building laylati. you still dream about it. \"we can plan a laylati revival meeting\" — i'm holding you to this.",
        },
        {
          label: "the postcards",
          sticker: "stickers/flower-pink.webp",
          back: "your sister's friend still has the postcards you got me from idk how many years ago.",
        },
        {
          label: "matcha girl",
          photo: "photos/blossom-matcha.webp",
          back: "\"i really am such a simple girl i love going on matcha dates w my girlies.\"<br>a matcha date is owed.",
        },
        {
          label: "50 hours",
          sticker: "stickers/heart-guy.webp",
          back: "we spent around 50 hours on calls this year. our longest one was 4 hours on june 12. i'd do 4 more right now.",
        },
      ],
    },
    {
      type: "photos",
      title: "soft girl era",
      note: "cherry blossoms, pink tops, iced coffee. mashallah 3aleyke beauty queen",
      strips: [
        { photos: [{ src: "photos/pink-cafe-1.webp", y: 12 }, { src: "photos/pink-cafe-2.webp", y: 12 }, { src: "photos/pink-cafe-3.webp", y: 26 }], caption: "3 poses, 0 bad angles", tilt: 3 },
        { photos: [{ src: "photos/blossom-pose.webp", y: 4 }, { src: "photos/blossom-reach.webp", y: 36 }, { src: "photos/blossom-flex.webp", y: 6 }, { src: "photos/blossom-branch.webp", y: 28 }], caption: "spring said her name", tilt: -3 },
      ],
      photos: [
        { src: "photos/iced-coffee.webp", caption: "two iced coffees, obviously", style: "polaroid", tilt: -4 },
        { src: "photos/cafe-pastry.webp", caption: "hot girl breakfast", style: "taped", tilt: 3 },
      ],
    },
    {
      type: "timeline",
      title: "your year",
      note: "you said \"i need a job\" every time i asked how you were. look at you now.",
      items: [
        { when: "nov", what: "\"i need a job 😭\" — your answer to literally everything" },
        { when: "jan", what: "the wind turbine analyst interview email." },
        { when: "apr 22", what: "signed the contract + lunch with your team lead and HR" },
        { when: "apr 29", what: "first day in the office. berlin girl officially" },
        { when: "sep", what: "\"and....they sent me the contract.\" FULL TIME. 🎉" },
        { when: "nov 2", what: "a new year of you. i'm so proud of you." },
      ],
      photo: { src: "photos/headshot.webp", caption: "corporate tatie 💼", tilt: 3, filter: "bw" },
    },
    {
      type: "photos",
      title: "the outtakes",
      note: "faces only i get to see. you're welcome for not posting them",
      strips: [
        { photos: [{ src: "photos/silly-1.webp", y: 92 }, "photos/pout.webp", { src: "photos/silly-2.webp", y: 100 }, { src: "photos/kiss-face.webp", y: 44 }], caption: "the 4 moods of tatie", filter: "bw", tilt: -3 },
      ],
      photos: [
        { src: "photos/cat.webp", caption: "the real boss", style: "taped", tilt: 4 },
        { src: "photos/facetime.webp", caption: "facetime at 1am", style: "polaroid", tilt: -3 },
        { src: "photos/beach-blue-hair.webp", caption: "blue hair era, never forget", style: "polaroid", tilt: -2, wide: true },
        { src: "photos/selfie-together.webp", caption: "us ♡", style: "taped", tilt: 3 },
        { src: "photos/hoops.webp", caption: "you're already beautiful. imagine how you look with hoops", style: "polaroid", tilt: -4, filter: "bw" },
      ],
    },
    {
      type: "stats",
      title: "tatie wrapped",
      subtitle: "1 nov 2025 → 24 oct 2026 · one whatsapp chat",
      big: [
        { value: 42719, label: "messages" },
        { value: 1568, label: "voice notes" },
        { value: 1263, label: "stickers" },
        { value: 50, suffix: "h", label: "on calls" },
      ],
      saidTitle: "how many times we've said this to each other",
      said: [
        { label: "\"bro\"", count: 863 },
        { label: "\"habibi\"", count: 684 },
        { label: "\"omg\"", count: 447 },
        { label: "\"i love you\"", count: 225 },
        { label: "keysmashes (ksnskdjd)", count: 167 },
        { label: "\"lowkey\"", count: 162 },
      ],
      receipt: [
        ["\"mahek\"", "90 (me: 0)"],
        ["🧍🏻‍♀️ deployed", "30"],
        ["\"sorry\" (for yapping)", "313"],
        ["texts between 1–5am", "1,746"],
        ["longest daily streak", "66 days"],
        ["most texts in a row", "227 (you)"],
        ["your top emoji", "😭 ×529"],
        ["runner up", "🤍 ×425"],
        ["avg reply time", "4 seconds"],
        ["who texts first", "basically a tie"],
      ],
      receiptFooter: "thank you for visiting bestie studio · no refunds · ever",
    },
    {
      type: "stickers",
      title: "sticker sheet",
      note: "our most sent stickers. peel them off and stick them anywhere on the page",
    },
  ],

  /* ---------- STICKERS ----------
     These get scattered over the scrapbook and can be dragged around. */
  stickers: [
    "stickers/carebears.webp",
    "stickers/crying-blob.webp",
    "stickers/flower-red.webp",
    "stickers/flower-pink.webp",
    "stickers/heart-guy.webp",
    "stickers/kitten-suit.webp",
    "stickers/blush-face.webp",
    "stickers/hearts.webp",
  ],

  /* little text stickers that also scatter around */
  wordStickers: ["mahek", "deal my love", "HAYETEEE", "bro 🧍🏻‍♀️", "ana bel aktar", "ksnskdjd", "lowkey", "ure so cute"],

  ending: "happy birthday tatie · made with love by reem",
};
