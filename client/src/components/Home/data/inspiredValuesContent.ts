export type InspiredValueDetail = {
  letter: string;
  label: string;
  definition: string;
  behaviors: string[];
  boxClass: string;
  letterClass: string;
  tilt: number;
};

export const inspiredValuesContent: InspiredValueDetail[] = [
  {
    letter: "I",
    label: "Integrity and Accountability",
    definition:
      "We exhibit honesty, incorruptibility, irreproachable conduct, and fidelity to sound moral and ethical values with full knowledge that public office is public trust and we are accountable to the people at all times.",
    behaviors: [
      "observe honesty and transparency in all aspects of work;",
      "demonstrate responsibility in all our actions and decisions;",
      "strive to do what is right even when no one is watching; and",
      "comply with all statutes and regulatory requirements governing public service.",
    ],
    boxClass: "bg-[#FFD700]",
    letterClass: "text-black",
    tilt: -3,
  },
  {
    letter: "N",
    label: "Nationalism",
    definition:
      "We instill a sense of national consciousness to develop citizenry dedicated to serve the Republic.",
    behaviors: [
      "demonstrate loyalty to the Republic by upholding the Philippine Constitution;",
      "inculcate love of country among our stakeholders;",
      "bring honor and pride to our country;",
      "contribute to the development of citizenry; and",
      "contribute to nation-building.",
    ],
    boxClass: "bg-[#800000]",
    letterClass: "text-white",
    tilt: 2,
  },
  {
    letter: "S",
    label: "Sense of Service",
    definition:
      "We are committed to perform our duties as public servants with an inherent desire to be of service to others.",
    behaviors: [
      "go beyond and above what is expected from a public servant;",
      "exhibit strong sense of community through volunteerism, outreach, and community engagements;",
      "emphasize virtues such as compassion and empathy;",
      "anticipate, recognize, and meet people's needs; and",
      "manifest selflessness by upholding public interest over and above personal interest.",
    ],
    boxClass: "bg-white",
    letterClass: "text-[#800000]",
    tilt: -2,
  },
  {
    letter: "P",
    label: "Passion for Learning and Innovation",
    definition:
      "We commit to steadfastly create new knowledges, methods, and mindsets to develop innovative solutions to societal problems.",
    behaviors: [
      "promote lifelong learning opportunities, including but not limited to, continuing professional and personal development; and",
      "exhibit deep-seated enthusiasm for discovery, invention, and innovation;",
    ],
    boxClass: "bg-[#FFD700]",
    letterClass: "text-black",
    tilt: 3,
  },
  {
    letter: "I",
    label: "Inclusivity",
    definition:
      "We create an academic community that openly embraces individuals regardless of their background where they feel valued, respected, and have equal opportunities.",
    behaviors: [
      "promote equity, diversity, social inclusion, and equal opportunity for all regardless of race, gender, nationality, ethnicity, ideology, language, religion, ability or any other status in the provision of educational programs and services;",
      "accept and embrace change;",
      "are consistent in its interaction with everyone; and",
      "foster a safe space where individuality is respected and valued.",
    ],
    boxClass: "bg-[#800000]",
    letterClass: "text-white",
    tilt: -2,
  },
  {
    letter: "R",
    label: "Respect for Human Rights and the Environment",
    definition:
      "We acknowledge that human rights and the environment are intertwined; human rights cannot be enjoyed without a safe, clean, and healthy environment.",
    behaviors: [
      "observe and respect fundamental human rights, including but not limited to, academic freedom, freedom of speech and expression, and freedom from discrimination and harassment;",
      "engage the PUP community and its partners in programs, projects, and activities that help protect the environment and adhere to rules and regulations that promote environmental sustainability; and",
      "establish a sustainable environmental governance that respects human rights.",
    ],
    boxClass: "bg-white",
    letterClass: "text-[#800000]",
    tilt: 2,
  },
  {
    letter: "E",
    label: "Excellence",
    definition:
      "We aim for outstanding performance in teaching and learning, research, extension services and community engagements, and internal governance.",
    behaviors: [
      "reflect continuing improvement and innovation;",
      "emphasize attention to details;",
      "observe coherence;",
      "adhere to high standards; and",
      "demonstrate resilience and perseverance.",
    ],
    boxClass: "bg-[#FFD700]",
    letterClass: "text-black",
    tilt: -3,
  },
  {
    letter: "D",
    label: "Democracy",
    definition:
      "We operate under a system where participatory and inclusive decision making, open dialogue, and respect for diverse perspectives prevail.",
    behaviors: [
      "encourage participation of all members of the PUP community;",
      "consult and involve stakeholders in decision-making;",
      "encourage openness and provide platforms for diverse voices to be heard and considered toward improving the services of the University; and",
      "demonstrate advocacy on socio-civic responsibility.",
    ],
    boxClass: "bg-[#800000]",
    letterClass: "text-white",
    tilt: 2,
  },
];
