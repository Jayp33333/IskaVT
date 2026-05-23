export type StrategicGoal = {
  id: string;
  title: string;
};

export type StrategicPillar = {
  number: number;
  title: string;
  accentClass: string;
  headerClass: string;
  goals: StrategicGoal[];
};

export const strategicGoalsContent: StrategicPillar[] = [
  {
    number: 1,
    title: "Teaching and Learning",
    accentClass: "bg-[#FFD700]",
    headerClass: "text-black",
    goals: [
      { id: "SG 1", title: "Innovative Curricula and Instruction" },
      { id: "SG 2", title: "Empowered, Expert, and Productive Faculty Members" },
      { id: "SG 3", title: "Holistic Student Development" },
    ],
  },
  {
    number: 2,
    title: "Research and Extension",
    accentClass: "bg-[#800000]",
    headerClass: "text-white",
    goals: [
      {
        id: "SG 4",
        title: "Intensified Research Innovation, Dissemination and Utilization",
      },
      {
        id: "SG 5",
        title: "Strengthened Sustainable and Impactful Extension Program",
      },
      {
        id: "SG 6",
        title:
          "Expanded Research and Extension Networks with Local, National, and International Partners",
      },
    ],
  },
  {
    number: 3,
    title: "Internal Governance",
    accentClass: "bg-white",
    headerClass: "text-[#800000]",
    goals: [
      { id: "SG 7", title: "Transformational University Leadership" },
      {
        id: "SG 8",
        title: "Judicious and Ethical Stewardship of Physical and Financial Resources",
      },
      { id: "SG 9", title: "Effective and Efficient Human Resource Management" },
      { id: "SG 10", title: "Excellent Citizen/Client Satisfaction" },
      { id: "SG 11", title: "Smart Campuses" },
    ],
  },
];
