export type AdministrationMember = {
  name: string;
  role: string;
};

export type AccreditationArea = {
  area: string;
  members: string[];
};

export const administrationDesignees: AdministrationMember[] = [
  {
    name: "Assoc. Prof. Ronaldo G. Bulfa",
    role: "Campus Director",
  },
  {
    name: "Assoc. Prof. Lourdes B. Avila",
    role: "Head, Academic Program",
  },
  {
    name: "Engr. Antonio P. Curva",
    role: "Administrative Officer and QMS Head",
  },
  {
    name: "Dr. Leilidyn Y. Zurbano",
    role: "Head, Student Affairs and Services",
  },
  {
    name: "Asst. Prof. Altagracia A. Silaya",
    role: "Collecting and Disbursing Officer",
  },
];

export const academicProgramStaff: AdministrationMember[] = [
  {
    name: "Assoc. Prof. Lourdes B. Avila",
    role: "Head, Academic Program",
  },
  {
    name: "Assoc. Prof. Maria Asuncion R. Del Castillo",
    role: "Quality Assurance Coordinator",
  },
  {
    name: "Devimar V. Marcaida",
    role: "OJT Coordinator",
  },
  {
    name: "Dr. Leilidyn Y. Zurbano",
    role: "Head, Student Affairs and Services",
  },
  {
    name: "Lynel P. Tabien",
    role: "Head, Laboratory",
  },
  {
    name: "Dr. Joel C. Magtibay",
    role: "Faculty Extensionist",
  },
  {
    name: "Cherry D. Landicho, RL",
    role: "Librarian II",
  },
];

export const studentAffairsStaff: AdministrationMember[] = [
  {
    name: "Dr. Leilidyn Y. Zurbano",
    role: "Head, Student Affairs and Services",
  },
  {
    name: "Marian B. Reynales, RPm",
    role: "Guidance Advocate",
  },
  {
    name: "Asst. Prof. Dionysius A. Velasquez",
    role: "Sports Coordinator",
  },
  {
    name: "Assoc. Prof. Josefina P. Babiera",
    role: "Chief, Admissions and Registration Officer",
  },
  {
    name: "Asst. Prof. Gilberto A. Villanueva",
    role: "Chief, Cultural Affairs",
  },
  {
    name: "Tito Ernesto Z. Loreto",
    role: "Admission Officer",
  },
  {
    name: "Wilbor B. De Asis",
    role: "Students Record Officer",
  },
];

export const administrativeOfficers: AdministrationMember[] = [
  {
    name: "Engr. Antonio P. Curva",
    role: "Administrative Officer and QMS Head",
  },
  {
    name: "Dr. Victoria Alma V. Conti",
    role: "Dentist",
  },
  {
    name: "Wilfredo B. Malabanan",
    role: "FAMO & Property Custodian",
  },
  {
    name: "Ruwena M. Yumul, RN",
    role: "Public Health Nurse",
  },
  {
    name: "Lynel P. Tabien",
    role: "Head, Laboratory",
  },
  {
    name: "Themistocles Jr. S. Yumul",
    role: "Security Officer",
  },
];

export const facultyRoster: string[] = [
  "Prof. Vince Czar S. Abel",
  "Prof. Walfrando E. Adan",
  "Prof. Jomar B. Alcantara",
  "Prof. Veronica S. Almase",
  "Prof. Rosario D. Anulao",
  "Prof. May Anne F. Araza",
  "Prof. Thadeus L. Arche Jr.",
  "Prof. Alex V. Avila",
  "Prof. Lourdes B. Avila",
  "Prof. Josefina P. Babiera",
  "Prof. Leah C. Barrameda",
  "Prof. Salvador U. Barros II",
  "Prof. Cesar B. Bermundo",
  "Prof. Joepet V. Brosas",
  "Prof. Rufo N. Bueza",
  "Prof. Jay Lexter D. Umali",
  "Prof. Isaias B. Ubana II",
  "Prof. Christopher B. Valencia",
  "Prof. Dionysius A. Velasquez",
  "Prof. Gilberto A. Villanueva",
  "Prof. Venus Villaver",
  "Prof. Tristan Kirt O. Yumul",
  "Prof. Leilidyn Y. Zurbano",
  "Prof. Marie Andrea E. Zurbano",
  "Prof. Reindel Sam P. Bulfa",
  "Prof. Ronaldo G. Bulfa",
  "Prof. Klaude M. Buñag",
  "Prof. Sienna Grace S. Calinga",
  "Prof. Darwyn Capio",
  "Prof. Merlin M. Capistrano",
  "Prof. Maribel D. Chan",
  "Prof. Antonio P. Curva",
  "Prof. Violeta A. Danes",
  "Prof. Jewel G. De Asis",
  "Prof. Patricacia Anne R. De Asis",
  "Prof. Maria Asuncion R. Del Castillo",
  "Prof. Mark Vence Dungca",
  "Prof. Cherrie Grace C. Entienza",
  "Prof. Jocelyn C. Entienza",
  "Prof. Nelson N. Entienza",
  "Prof. Mitchelle C. Hutalla",
  "Prof. Jayson C. Jucom",
  "Prof. Rodel O. Florido",
  "Prof. Ma. Luisa N. Francisco",
  "Prof. Jenny C. Linguete",
  "Prof. Joanne Michelle D. Lee",
  "Prof. Benedick B. Labaco",
  "Prof. Jayson A. Magnaye",
  "Prof. Tito Ernesto Z. Loreto",
  "Prof. Lerma D. Lotereña",
  "Prof. Lesly Ann H. Magtibay",
  "Prof. Roland V. Magsino",
  "Prof. Joel C. Magtibay",
  "Prof. Regidor Mapanao",
  "Prof. Marvi Anne Mañago",
  "Prof. Christine S. Manzanero",
  "Prof. Hiroshi Sen T. Mera",
  "Prof. Devimar V. Marcaida",
  "Prof. Jimar Marjalino",
  "Prof. Icon C. Obmerga",
  "Prof. Erick A. Molines",
  "Prof. Mildred M. Mondragon",
  "Prof. Jer Anthony F. Palo",
  "Prof. George D. Omongos",
  "Prof. Dave M. Perion",
  "Prof. Edelyn A. Pamilaran",
  "Prof. Cesar S. Perion",
  "Prof. Kent B. Pitero",
  "Prof. Elenita R. Portez",
  "Prof. Sergio Jr. V. Pineda",
  "Prof. Ignacio B. Razona",
  "Prof. Marian R. Garduña",
  "Prof. Riza Rizalina A. Quincina",
  "Prof. Joscelle Joyce L. Rivera",
  "Prof. Melanie R. Sario",
  "Prof. Robin B. Reynosa",
  "Prof. Altagracia A. Silaya",
  "Prof. Ruth Jade C. Simbulan",
  "Prof. Maria Villa A. Sarmiento",
  "Prof. Sarah G. Tabien",
  "Prof. Mark Rey U. Tan",
  "Prof. Lynel P. Tabien",
  "Prof. Rodones S. Trimillos",
  "Prof. Francis M. Jimenez",
  "Prof. Bernie D. Teguenos",
];

export const accreditationTaskForceLeads: AdministrationMember[] = [
  {
    name: "Assoc. Prof. Ronaldo G. Bulfa",
    role: "Campus Director",
  },
  {
    name: "Assoc. Prof. Maria Asuncion R. Del Castillo",
    role: "Quality Assurance Coordinator",
  },
];

export const accreditationAreas: AccreditationArea[] = [
  {
    area: "Area I",
    members: [
      "Prof. Mildred M. Mondragon",
      "Prof. Riza Rizalina A. Quincina",
      "Prof. Maria Villa A. Sarmiento",
    ],
  },
  {
    area: "Area II",
    members: [
      "Prof. May Anne F. Araza",
      "Prof. Lourdes B. Avila",
      "Prof. Maria Asuncion R. Del Castillo",
      "Prof. Dionysius A. Velasquez",
      "Prof. Christopher B. Valencia",
    ],
  },
  {
    area: "Area III",
    members: [
      "Prof. Josefina P. Babiera",
      "Prof. Hiroshi Sen T. Mera",
      "Prof. Marie Andrea E. Zurbano",
      "Prof. Icon C. Obmerga",
    ],
  },
  {
    area: "Area IV",
    members: [
      "Prof. Tristan Kirt O. Yumul",
      "Prof. Kent B. Pitero",
      "Prof. Mark Rey U. Tan",
      "Prof. Tito Ernesto Z. Loreto",
      "Prof. Marian R. Garduña",
      "Prof. Leilidyn Y. Zurbano",
    ],
  },
  {
    area: "Area V",
    members: [
      "Prof. Lesly Ann H. Magtibay",
      "Prof. Vince Czar S. Abel",
      "Prof. Elenita R. Portez",
      "Prof. Jayson C. Jucom",
      "Prof. Altagracia A. Silaya",
      "Prof. Leilidyn Y. Zurbano",
    ],
  },
  {
    area: "Area VI",
    members: [
      "Prof. Thadeus L. Arche Jr.",
      "Prof. Ma. Luisa N. Francisco",
      "Prof. Bernie D. Teguenos",
      "Prof. Jay Lexter D. Umali",
      "Prof. Salvador U. Barros II",
      "Prof. Sarah G. Tabien",
      "Prof. Joel C. Magtibay",
    ],
  },
  {
    area: "Area VII",
    members: [
      "Cherry D. Landicho, RL",
      "Wilfredo B. Malabanan",
      "Mary Ann D. Padua",
    ],
  },
  {
    area: "Area VIII",
    members: [
      "Dr. Victoria Alma V. Conti",
      "Prof. Antonio P. Curva",
      "Prof. Nelson N. Entienza",
      "Ruwena M. Yumul, RN",
      "Ruperto I. Almase",
      "Alvin A. Argosino",
      "Wilbor B. De Asis",
      "Garito E. Fabi",
    ],
  },
  {
    area: "Area IX",
    members: ["Prof. Lynel P. Tabien", "Prof. Gilberto A. Villanueva"],
  },
  {
    area: "Area X",
    members: [
      "Prof. Ronaldo G. Bulfa",
      "Prof. Joanne Michelle D. Lee",
      "Prof. Devimar V. Marcaida",
      "Judith M. Marjalino",
    ],
  },
];

export type AdministrationOfficeSection = {
  id: string;
  title: string;
  members: AdministrationMember[];
};

export const administrationOfficeSections: AdministrationOfficeSection[] = [
  {
    id: "academic-program",
    title: "Academic Program",
    members: academicProgramStaff,
  },
  {
    id: "student-affairs",
    title: "Student Affairs & Services",
    members: studentAffairsStaff,
  },
  {
    id: "administrative-officers",
    title: "Administrative Officers",
    members: administrativeOfficers,
  },
];
