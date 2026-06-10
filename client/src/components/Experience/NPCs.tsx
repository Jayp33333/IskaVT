import { MODEL_PATHS } from "../../data/modelRegistry";
import { NPC } from "./NPC";

type DialogStep = {
  message: string;
  options?: { label: string; next: number | null }[];
};

type NPCData = {
  position: [number, number, number];
  model?: string;
  name?: string;
  scale?: number | [number, number, number];
  rotation?: [number, number, number];
  dialogs: DialogStep[];
  color?: string;
};

const npcData: NPCData[] = [
  {
    position: [12, 0, 1],
    model: MODEL_PATHS.guard,
    name: "Guard",
    scale: 1.1,
    rotation: [0, -90, 0],
    color: "#D43F3F",
    dialogs: [
      {
        message: "Hello! Welcome to PUP Lopez Campus. What would you like to know?",
        options: [
          { label: "How to enroll?", next: 1 },
          { label: "How do I get there?", next: 2 },
          { label: "Who are you?", next: 3 },
          { label: "Goodbye", next: null },
        ],
      },
      {
        message: "To enroll, visit the Registrar's Office or check our official website. You'll need your admission documents and valid IDs. The enrollment period is usually announced at the start of each semester.",
        options: [
          { label: "Anything else?", next: 0 },
          { label: "Goodbye", next: null },
        ],
      },
      {
        message: "You can reach PUP Lopez via public transport. Jeepneys and tricycles stop near the main gate. If you're driving, we have a parking area inside the campus. The main buildings are easy to find once you enter.",
        options: [
          { label: "Anything else?", next: 0 },
          { label: "Goodbye", next: null },
        ],
      },
      {
        message: "I am the campus guard. I make sure everyone is safe and help visitors find their way.",
        options: [
          { label: "Any tips?", next: 4 },
          { label: "Thanks!", next: null },
        ],
      },
      {
        message: "Always keep your ID with you, and follow campus rules.",
        options: [
          { label: "Anything else?", next: 0 },
          { label: "Got it!", next: null },
        ],
      },
    ],
  },
  {
    position: [1, 1.1, -10],
    model: MODEL_PATHS.professor,
    name: "Professor",
    scale: 1,
    rotation: [0, 90, 0],
    color: "#2563eb",
    dialogs: [
      {
        message: "Hello Iska! I hope you are ready for class. What can I help you with?",
        options: [
          { label: "How to enroll in your class?", next: 1 },
          { label: "Where is the classroom?", next: 2 },
          { label: "Any advice for students?", next: 3 },
          { label: "Goodbye", next: null },
        ],
      },
      {
        message: "You can enroll through the student portal or add the subject during the enrollment period. Make sure you meet the prerequisites. See the Registrar if you have any conflicts.",
        options: [
          { label: "Anything else?", next: 0 },
          { label: "Thank you!", next: null },
        ],
      },
      {
        message: "The classroom is in the main building. Check your schedule for the room number. You can also use the campus map — it's available near the entrance.",
        options: [
          { label: "Anything else?", next: 0 },
          { label: "Thanks!", next: null },
        ],
      },
      {
        message: "Always review your notes before class, stay curious, and don't hesitate to ask questions. Office hours are there for a reason!",
        options: [
          { label: "Anything else?", next: 0 },
          { label: "Thank you!", next: null },
        ],
      },
    ],
  },
];

const NPCs = () => (
  <>
    {npcData.map((npc, idx) => (
      <NPC
        key={idx}
        id={`npc-${idx}`}
        position={npc.position}
        model={npc.model}
        name={npc.name || "NPC"}
        scale={npc.scale ?? 1}
        rotation={npc.rotation ?? [0, 0, 0]}
        dialogs={npc.dialogs}
        color={npc.color}
      />
    ))}
  </>
);

export default NPCs;
