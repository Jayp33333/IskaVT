export type AboutSectionId =
  | "vision-mission"
  | "philosophy"
  | "goals"
  | "values"
  | "history"
  | "hymn";

export type AboutContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "paragraphs"; items: string[] }
  | { type: "list"; intro?: string; items: string[] }
  | { type: "inspired-values" }
  | { type: "strategic-goals" }
  | { type: "hymns" }
  | {
      type: "sections-with-video";
      sections: { title: string; content: AboutContentBlock }[];
      youtubeId: string;
      videoTitle?: string;
    }
  | {
      type: "sections";
      sections: { title: string; content: AboutContentBlock }[];
    };

export const aboutNavLinks: { name: string; path: string }[] = [
  { name: "Programs", path: "/programs" },
  { name: "Vision & Mission", path: "/about/vision-mission" },
  { name: "Philosophy", path: "/about/philosophy" },
  { name: "Strategic Goals", path: "/about/goals" },
  { name: "Core Values", path: "/about/values" },
  { name: "History", path: "/about/history" },
  { name: "Hymn", path: "/about/hymn" },
];

export const defaultAboutSection: AboutSectionId = "vision-mission";

export const aboutSectionIds = aboutNavLinks
  .filter((link) => link.path.startsWith("/about/"))
  .map((link) => link.path.replace("/about/", "") as AboutSectionId);

export function isAboutSectionId(value: string): value is AboutSectionId {
  return aboutSectionIds.includes(value as AboutSectionId);
}

export type ProgramOffer = {
  code: string;
  title: string;
};

export const undergraduateDegreeCourses: ProgramOffer[] = [
  { code: "BEED", title: "Bachelor of Elementary Education" },
  { code: "BPA", title: "Bachelor of Public Administration" },
  {
    code: "BPA-FA",
    title: "Bachelor of Public Administration major in Fiscal Administration",
  },
  { code: "BSA", title: "Bachelor of Science in Accountancy" },
  { code: "BSAM", title: "Bachelor of Science in Agribusiness Management" },
  { code: "BSArch", title: "Bachelor of Science in Architecture" },
  {
    code: "BSBA-FM",
    title: "Bachelor of Science in Business Administration major in Financial Management",
  },
  {
    code: "BSBA-MM",
    title: "Bachelor of Science in Business Administration major in Marketing Management",
  },
  { code: "BSBio", title: "Bachelor of Science in Biology" },
  { code: "BSCE", title: "Bachelor of Science in Civil Engineering" },
  {
    code: "BSED-MT",
    title: "Bachelor of Secondary Education major in Mathematics",
  },
  { code: "BSEE", title: "Bachelor of Science in Electrical Engineering" },
  { code: "BSHM", title: "Bachelor of Science in Hospitality Management" },
  { code: "BSIT", title: "Bachelor of Science in Information Technology" },
  { code: "BSND", title: "Bachelor of Science in Nutrition and Dietetics" },
  { code: "BSOA", title: "Bachelor of Science in Office Administration" },
];

export const undergraduateDiplomaCourses: ProgramOffer[] = [
  { code: "DCVET", title: "Diploma in Civil Engineering Technology" },
  { code: "DCET", title: "Diploma in Computer Engineering Technology" },
  { code: "DEET", title: "Diploma in Electrical Engineering Technology" },
  { code: "DIT", title: "Diploma in Information Technology" },
  {
    code: "DOMT-L",
    title: "Diploma in Office Management Technology – Legal Office Management",
  },
  {
    code: "DOMT-M",
    title: "Diploma in Office Management Technology – Medical Office Management",
  },
];

export const graduatePrograms: ProgramOffer[] = [
  { code: "MEM", title: "Master in Education Management" },
  { code: "MPA", title: "Master in Public Administration" },
  { code: "MSCM", title: "Master of Science in Construction Management" },
];

export const aboutContent: Record<
  AboutSectionId,
  { title: string; content: AboutContentBlock }
> = {
  "vision-mission": {
    title: "Vision & Mission",
    content: {
      type: "sections-with-video",
      youtubeId: "Lp_x4dWvLs4",
      videoTitle: "PUP Vision and Mission",
      sections: [
        {
          title: "Vision",
          content: {
            type: "paragraph",
            text: "A Leading Comprehensive Polytechnic University in Asia",
          },
        },
        {
          title: "Mission",
          content: {
            type: "paragraph",
            text: "Advance an inclusive, equitable, and globally relevant Polytechnic Education towards National Development",
          },
        },
      ],
    },
  },
  philosophy: {
    title: "Philosophy",
    content: {
      type: "list",
      intro: "As a State University, PUP Lopez believes that:",
      items: [
        "Education is an instrument for the development of the citizenry and the enhancement of national building;",
        "Meaningful growth and transformation of the country are best achieved in an atmosphere of brotherhood, peace, freedom, justice and a nationalist-oriented education imbued with the spirit of humanist internationalism.",
      ],
    },
  },
  goals: {
    title: "Strategic Goals",
    content: {
      type: "strategic-goals",
    },
  },
  values: {
    title: "Core Values",
    content: {
      type: "inspired-values",
    },
  },
  history: {
    title: "History",
    content: {
      type: "paragraphs",
      items: [
        "PUP Lopez Campus was established in February 13, 1979 during the Presidency of Dr. Pablo T. Mateo, Jr. At that time, Philippine Normal College (now PNU) and Eulogio Amang Rodriguez Institute of Science & Technology (EARIST) were then in consortia with PUP Lopez.",
        "PUP Lopez Campus came into existence when Southern Pacific College, a private college, owned by the heirs of the late Don Gregorio C. Yumul, Sr., donated the site and the school buildings with all the facilities therein. There was one concrete three-storey with 21 classrooms and another two-storey building made of wood, which housed the library, the faculty rooms and administrative offices. The site with total land area of 23,724 square meters is located at Yumul St., Brgy. Del Pilar (now Brgy. Burgos), Lopez, Quezon.",
        "For its initial year of operation (1979-1980), PUP Lopez had 44 full-time and part-time faculty including the high school faculty members. It offered (1) Bachelor in Accountancy (BA) (now Bachelor of Science in Accountancy), (2) Bachelor in Business Management (BBM) (now Bachelor of Science in Business Administration), (3) Bachelor in Office Administration (BOA) (now Bachelor of Science in Office Administration), (4) Bachelor in Library Arts (BLA), and (5) Bachelor in Applied Economics (BAE). The first Director was Atty. Juan T. Publico. New enrollees were admitted but the high school students of the former SPC were absorbed as initial students of PUP Laboratory High School.",
        "BLA and BAE were phased out and a new course, Bachelor in Agri-Business Management (BAM) (now Bachelor of Science in Agri-Business Management) was offered. Dr. Nemesio E. Prudente assumed his office as the next President in 1987. During his term, he put up a gymnasium where socio-cultural as well as sports and Physical Education activities were held. This was destroyed by super typhoon \"Rosing\" in November 1995.",
        "In 1990, Dr. Prudente offered two new courses; Bachelor of Science in Civil Engineering (BSCE) and Bachelor of Science in Electrical Engineering (BSEE). During the same year, he and Dr. Samuel M. Salvador introduced and started the operation of Pamantasang Bayan, which offered free vocational-technical courses. This was followed by offering distance education course, Master in Education Management (MEM) through the Open University Education Program.",
        "In 1998, Dr. Ofelia M. Carague became President and ordered the construction of a new gymnasium. In 1999, CHED ordered the gradual phase out of PUP Lopez laboratory high school. The last batch graduated on April 6, 2003. In 2001, Congresswoman Georgilu R. Yumul-Hermida donated a concrete 2-storey 12-classroom building for academic purposes.",
        "In 2010, the late Quezon Gov. Rafael P. Nantes donated a 2-storey building with 10 classrooms. The Bachelor of Science in Hotel and Restaurant Management (BSHRM) was offered along with Diploma in Office Management Technology (DOMT). In 2011, Bachelor in Secondary Education (BSEd) major in mathematics was offered, along with BSHM and Diploma in Accounting Management Technology (DAMT).",
        "In June 2013, new courses were offered: Bachelor in Public Administration (BPA), Diploma in Electrical Engineering Technology (DEET), and Diploma in Information Communication Technology (DICT). PUP Lopez produced topnotchers in Civil and Electrical Engineering board examinations, including Engr. Arvin B. Venzuela, Engr. Mark Harry T. Reyes (9th Place), and Engr. Kenneth B. Enopeques (5th Place).",
        "Right now, PUP Lopez continues its strong commitment to the public of delivering quality services that would help society in the realization of its goals and ambitions.",
      ],
    },
  },
  hymn: {
    title: "Hymn",
    content: {
      type: "hymns",
    },
  },
};
