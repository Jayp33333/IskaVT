export type HymnEntry = {
  title: string;
  subtitle?: string;
  authors?: string;
  note?: string;
  youtubeId?: string;
  videoTitle?: string;
  stanzas: string[][];
};

export const hymnContent: HymnEntry[] = [
  {
    title: "PUP Hymn",
    subtitle: "Imno ng PUP",
    authors: "S. Calabig, S. Roldan, and R. Amaranto",
    youtubeId: "Yib_s5UeGvc",
    videoTitle: "PUP Hymn",
    stanzas: [
      [
        "Sintang Paaralan",
        "Tanglaw ka ng bayan",
        "Pandayan ng isip ng kabataan",
        "Kami ay dumating nang salat sa yaman",
        "Hanap na dunong ay iyong alay",
      ],
      [
        "Ang layunin mong makatao",
        "Dinarangal ang Pilipino",
        "Ang iyong aral, diwa, adhikang taglay",
        "PUP, aming gabay",
      ],
      [
        "Paaralang dakila",
        "PUP, pinagpala",
        "Gagamitin ang karunungan",
        "Mula sa iyo, para sa bayan",
      ],
      [
        "Ang iyong aral, diwa, adhikang taglay",
        "PUP, aming gabay",
        "Paaralang dakila",
        "PUP, pinagpala",
      ],
    ],
  },
];
