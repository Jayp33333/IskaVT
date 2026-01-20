import { NPC } from "./NPC";

type DialogStep = {
  message: string;
  options?: { label: string; next: number | null }[];
};

type NPCData = {
  position: [number, number, number];
  model: string;
  name?: string;
  scale?: number | [number, number, number];
  rotation?: [number, number, number];
  dialogs: DialogStep[];
};

const npcData: NPCData[] = [
  {
    position: [12, 0, 1],
    model: "/models/avatars/guard.glb",
    name: "Guard",
    scale: 1.1,
    rotation: [0, -90, 0],
    dialogs: [
      {
        message: "Hello! Welcome to PUP Lopez Campus.",
        options: [
          { label: "Who are you?", next: 1 },
          { label: "Goodbye", next: null },
        ],
      },
      {
        message: "I am the campus guard. I make sure everyone is safe.",
        options: [
          { label: "Thanks!", next: null },
          { label: "Any tips?", next: 2 },
        ],
      },
      {
        message: "Always keep your ID with you, and follow campus rules.",
        options: [{ label: "Got it!", next: null }],
      },
    ],
  },
  {
    position: [1, 1.1, -10],
    model: "/models/avatars/professor1.glb",
    name: "Professor",
    scale: 1,
    rotation: [0, 90, 0],
    dialogs: [
      {
        message: "Hello Iska! I hope you are ready for class.",
        options: [
          { label: "Yes, professor!", next: null },
          { label: "Any advice?", next: 1 },
        ],
      },
      {
        message: "Always review your notes and stay curious.",
        options: [{ label: "Thank you!", next: null }],
      },
    ],
  },
];

const NPCs = () => (
  <>
    {npcData.map((npc, idx) => (
      <NPC
        key={idx}
        position={npc.position}
        model={npc.model}
        name={npc.name || "NPC"}
        scale={npc.scale ?? 1}
        rotation={npc.rotation ?? [0, 0, 0]}
        dialogs={npc.dialogs}
      />
    ))}
  </>
);

export default NPCs;
