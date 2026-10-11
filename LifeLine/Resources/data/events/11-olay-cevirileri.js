// Olay tanımları. Alan açıklamaları: data/README.md
// Kayıt uyumluluğu için mevcut olay başlıklarını (t) değiştirirken dikkat edin.
const FE = [
  [
    "Message to the wrong person",
    "You accidentally sent that very personal text meant for your partner to the work group chat.",
    [
      "Delete it right away",
      "Twenty people had already seen it before you deleted it. The next day everyone smiles at you.",
    ],
    [
      "Say it was a joke",
      "Nobody believed you, but they admired your nerve.",
      "You became an office legend, everybody loves you.",
    ],
    [
      "Throw the phone into the sea",
      "You bought a new phone but the embarrassment didn't go away.",
    ],
  ],
  [
    "Pharmacy embarrassment",
    "You're buying protection at the pharmacy and the person behind you is your mom's neighbor.",
    ["Stay calm", "You bought it with confidence and even the neighbor said hello."],
    [
      "Grab a chocolate too and run",
      "It was a weird combo and the pharmacist barely held back a laugh.",
    ],
    ["Go to another pharmacy", "You walked half an hour but you felt relieved."],
  ],
  [
    "Pants on the first date",
    "When you stood up at the restaurant, your pants ripped all the way down the back.",
    [
      "Tie your jacket around your waist",
      "You left in your jacket and your date's laughter made the whole restaurant laugh.",
      "Your date loved this side of you, a second date is guaranteed!",
    ],
    ["Laugh it off", "Your confidence impressed everyone."],
  ],
  [
    "Sounds through the wall",
    "You can clearly hear your downstairs neighbor's midnight noises through the wall.",
    ["Bang on the ceiling", "They went quiet, then whispered until morning."],
    ["Put in earbuds", "Your playlist has never been this useful."],
    [
      "Buy them a coffee in the morning",
      "When you made eye contact with the neighbor you both blushed.",
    ],
  ],
  [
    "Swimsuit mishap",
    "While jumping in the choppy sea, your swimsuit slipped down.",
    ["Sink into the water", "You stayed in the water for an hour until your fingers pruned."],
    [
      "Laugh and come out",
      "The beach applauded and nobody forgot you.",
      "Someone on the beach asked for your number!",
    ],
  ],
  [
    "Ex's wedding",
    "Your ex sent a wedding invitation that says 'plus one'.",
    ["Go alone", "All the relatives looked at you with pity and you went to the buffet twice."],
    [
      "Find someone attractive",
      "You convinced a friend, and the two of you became the talk of the wedding.",
      "By the end of the night you and your friend felt like you'd really just met.",
    ],
    ["Don't go", "You stayed as calm as a kitten in a rose garden."],
  ],
  [
    "Office romance",
    "The coworker at the next desk winked at you and offered a coffee break.",
    [
      "Go for coffee",
      "The coffee break dragged on and everyone figured out what was going on.",
      "You really had a great time and started dating.",
    ],
    ["Stay professional", "You kept your distance and everything at the office is normal."],
    ["Tell HR", "HR opened a file and the atmosphere got tense."],
  ],
  [
    "Bachelor party",
    "Your best friend's bachelor party is in Bodrum.",
    ["Go all out", "You partied until morning and your phone has photos you don't understand."],
    ["Be reasonable", "You went to bed early and woke up before everyone to make breakfast."],
  ],
  [
    "Flirting at the gym",
    "Someone at the gym is getting very close under the pretense of showing you the equipment.",
    [
      "Flirt back",
      "You both kept trying to use the same machine for minutes.",
      "They gave you their number and now you're texting.",
    ],
    ["Escape with headphones", "You turned up the music and went back to your workout."],
  ],
  [
    "Wrong file in the presentation",
    "While sharing your screen in the meeting, your personal photos popped up.",
    ["Close it quickly", "It lasted three seconds but everyone saw."],
    [
      "Make a joke",
      "The room burst out laughing and you saved the mood.",
      "Even the manager laughed; you became the team's favorite.",
    ],
  ],
  [
    "Nightclub",
    "The DJ called you on stage and everyone is watching you.",
    [
      "Go up and dance",
      "You danced but tripped and fell.",
      "The crowd applauded and lots of people took photos with you.",
    ],
    ["Say no", "You sipped your drink at the bar and watched."],
  ],
  [
    "Romantic evening",
    "You prepared a candlelit dinner at home.",
    [
      "Set everything up",
      "Candles, music and wine... the night was long and you both woke up smiling.",
    ],
    ["Order in", "You said takeout works too and watched a movie."],
  ],
  [
    "Singing in the bathroom",
    "The door opened while you were belting a song in the bathroom.",
    ["Pull the curtain", "You kept singing behind the curtain."],
    ["Sing together", "You did a duet and the neighbors applauded."],
  ],
  [
    "Camping tent",
    "You went camping with friends and the tent wall is paper thin.",
    ["Put in earbuds", "All night you tried to sleep through what you heard from the next tent."],
    ["Tease them in the morning", "In the morning everyone giggled at each other."],
  ],
  [
    "Your old teacher on a date",
    "The person you met turned out to be the teacher who taught you as a kid.",
    [
      "Chat",
      "You talked about the old days for an hour and had a lot of fun.",
      "The conversation was great and you started dating.",
    ],
    [
      "Back out and run",
      "You made up an excuse and the next day ignored their messages out of embarrassment.",
    ],
  ],
  [
    "Hair dye disaster",
    "You dyed your hair at home and the color came out very different from what you expected.",
    ["Rush to the hairdresser", "The hairdresser looked shocked and fixing it cost a lot."],
    [
      "Say it's your style",
      "Everyone asked about it and you got lots of compliments.",
      "Your new style was a hit and your looks shone.",
    ],
  ],
  [
    "Secret messages",
    "A notification popped up on your partner's phone while they were in the shower.",
    [
      "Look",
      "It turned out they were planning a surprise party for you and you felt awful.",
      "You found flirty messages they sent to someone else!",
    ],
    ["Don't touch it", "You suppressed your curiosity and trust grew."],
  ],
  [
    "Blind date",
    "Your friends set you up on a blind date and there are only two plates at the spot.",
    [
      "Go",
      "Your date talked about their ex for 40 minutes.",
      "Your date was amazing and you started dating.",
    ],
    ["Make up an excuse", "Your friends interrogated you for a long time."],
  ],
  [
    "Magic blender",
    "You bought the 'solves everything' blender from the ad and the manual is very strange.",
    [
      "Read the manual",
      "The sentences in the manual made you laugh; at least the smoothie turned out nice.",
    ],
    ["Put it away unused", "It took its place at the back of the cupboard."],
  ],
];
EV.slice(-(FE.length + 9), -9).forEach((e, i) => {
  const x = FE[i];
  TX[e.t] = x[0];
  TX[e.d] = x[1];
  e.c.forEach((c, j) => {
    const y = x[2 + j];
    TX[c.t] = y[0];
    TX[c.m] = y[1];
    if (c.w) TX[c.w[1]] = y[2];
  });
});
