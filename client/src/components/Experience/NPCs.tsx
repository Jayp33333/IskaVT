import { MODEL_PATHS } from "../../data/modelRegistry";
import type { SpeechVoiceProfile } from "../../features/contact/hooks/useFaqSpeech";
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
  voiceProfile?: SpeechVoiceProfile;
  voicePitch?: number;
  voiceRate?: number;
};

const npcData: NPCData[] = [
  {
    position: [12, 0, 1],
    model: MODEL_PATHS.guard,
    name: "Guard",
    scale: 1.2,
    rotation: [0, -90, 0],
    color: "#D43F3F",
    voiceProfile: "male",
    voicePitch: 0.82,
    voiceRate: 1.05,
    dialogs: [
      {
        message:
          "Good day! Welcome to PUP Lopez. I am one of the campus security personnel assigned here at the main gate. Before you go in, make sure you have a valid ID with you. How can I assist you?",
        options: [
          { label: "What are the campus rules?", next: 1 },
          { label: "Where is the Admin Building?", next: 2 },
          { label: "How do visitors enter?", next: 3 },
          { label: "Help me find a building.", next: 4 },
          { label: "Any parking rules?", next: 5 },
          { label: "Security tips?", next: 6 },
          { label: "Goodbye", next: null },
        ],
      },
      {
        message:
          "On campus, always wear or carry your school ID where it can be seen. Follow posted rules — no smoking in unauthorized areas, keep noise down near classrooms, and respect office hours. Loitering is not allowed after closing time. If you see anything suspicious, report it immediately to us at the gate or to the Administration Building. We are here to keep everyone safe.",
        options: [
          { label: "Anything else?", next: 0 },
          { label: "Understood!", next: null },
        ],
      },
      {
        message:
          "The Administration Building is the main hub for student transactions — enrollment, Registrar, Accounting, and clearances. Head straight from the main gate and look for the Admin Building on the campus map. For enrollment concerns, go to the Registration Office during office hours: Monday to Friday, 8:00 AM to 5:00 PM. Some offices pause during lunch, usually 12:00 NN to 1:00 PM.",
        options: [
          { label: "Anything else?", next: 0 },
          { label: "Thank you!", next: null },
        ],
      },
      {
        message:
          "Walk-in visitors are allowed during office hours. Please present a valid ID at the gate when asked. For group tours or official visits, contact the campus in advance at lopez@pup.edu.ph. The campus is closed on Sundays. On Saturdays, only limited offices are open from 8:00 AM to 5:00 PM. Parents and guests — please proceed directly to the office you are visiting.",
        options: [
          { label: "Anything else?", next: 0 },
          { label: "Got it!", next: null },
        ],
      },
      {
        message:
          "Use the destination pin icon in this virtual tour to navigate to any building — the Pylon is a good landmark at the center of campus. The Administration Building, Yumul Building, Engineering Building, and Com Labs are among the busiest spots. If you are on campus in person and get lost, come back to the guard house and we will point you in the right direction.",
        options: [
          { label: "Anything else?", next: 0 },
          { label: "Thanks!", next: null },
        ],
      },
      {
        message:
          "If you are bringing a vehicle, park only in designated areas inside the campus. Do not block driveways, fire lanes, or building entrances. Lock your vehicle and do not leave valuables in plain sight. Tricycles and jeepneys can drop off near the main gate — from there, most buildings are a short walk away.",
        options: [
          { label: "Anything else?", next: 0 },
          { label: "Will do!", next: null },
        ],
      },
      {
        message:
          "Keep your belongings with you at all times — do not leave bags unattended in hallways or the grandstand area. Travel in groups when leaving campus late. Know the campus hotlines: (042) 302-5249, 841-1149, or 841-1890. In an emergency, contact us at the gate right away. Stay alert, stay safe, and enjoy your visit to PUP Lopez.",
        options: [
          { label: "Anything else?", next: 0 },
          { label: "Stay safe!", next: null },
        ],
      },
    ],
  },
  {
    position: [29.7, 3.6, -3], 
    model: MODEL_PATHS.campusDirector,
    name: "Dir. Ronaldo G. Bulfa",
    scale: 1.5,
    rotation: [0, 180, 0],
    color: "#2563eb",
    voiceProfile: "male",
    dialogs: [
      {
        message:
          "Good day! Welcome to PUP Lopez. I am Ronaldo G. Bulfa, Campus Director of this branch. How may I help you today?",
        options: [
          { label: "Tell me about yourself, Director.", next: 1 },
          { label: "What is your vision for PUP Lopez?", next: 2 },
          { label: "What about ROTC and leadership?", next: 8 },
          { label: "What programs are offered here?", next: 3 },
          { label: "How do I enroll as a student?", next: 4 },
          { label: "Share the history of this campus.", next: 5 },
          { label: "Any message for new students?", next: 6 },
          { label: "Can we visit or tour the campus?", next: 7 },
          { label: "Goodbye", next: null },
        ],
      },
      {
        message:
          "I serve as Campus Director of PUP Lopez, overseeing the academic and operational management of this satellite campus. I am also Lieutenant Colonel (Infantry), Philippine Army Reserve — combining my work in education with service in the Philippine Army Reserve Command. I work closely with Ms. Lourdes B. Avila on academic programs, Ms. Josefina P. Babiera on registration, and Mr. Antonio P. Curva on administration, so that every student receives quality education rooted in discipline, leadership, and public service.",
        options: [
          { label: "Tell me about your military service.", next: 8 },
          { label: "What is your vision?", next: 2 },
          { label: "Anything else?", next: 0 },
          { label: "Thank you, Director!", next: null },
        ],
      },
      {
        message:
          "My leadership at PUP Lopez emphasizes institutional discipline, community engagement, and accessible education for Southern Quezon. We integrate civic responsibility and military training programs that align with PUP's public service mandate. Through extension programs and local partnerships, we support development across Quezon Province — while preparing graduates who excel in their professions and serve the nation with integrity.",
        options: [
          { label: "Anything else?", next: 0 },
          { label: "That is inspiring!", next: null },
        ],
      },
      {
        message:
          "PUP Lopez offers undergraduate degrees, diploma courses, and graduate programs across education, engineering, business, IT, hospitality, and the sciences — BSIT, BSCE, BSEE, BSHM, BEED, BSA, BPA, and many more. We are especially proud of our engineering programs — our graduates have placed among the top board examinees in Civil and Electrical Engineering. For the complete list of programs and admission requirements, visit our Programs page or the Registrar's Office in the Administration Building.",
        options: [
          { label: "How do I enroll?", next: 4 },
          { label: "Anything else?", next: 0 },
          { label: "Thank you!", next: null },
        ],
      },
      {
        message:
          "Enrollment is handled by our Registration Office, led by Ms. Josefina P. Babiera. Visit the Administration Building during the official enrollment period with your admission documents and valid IDs. Continuing students may enroll through the PUP Student Information System (SIS). Whether you are a freshman, transferee, regular, or irregular student — prepare your requirements early and coordinate with the Registration Office for your specific enrollment process.",
        options: [
          { label: "Anything else?", next: 0 },
          { label: "Got it!", next: null },
        ],
      },
      {
        message:
          "PUP Lopez was established on February 13, 1979, when the heirs of the late Don Gregorio C. Yumul, Sr. donated the site of the former Southern Pacific College — including its buildings on 23,724 square meters along Yumul Street, Brgy. Burgos. Our first Director was Atty. Juan T. Publico. Over the decades, generous partners like Congresswoman Georgilu R. Yumul-Hermida and the late Gov. Rafael P. Nantes helped expand our campus. Today, the Yumul Building and Nantes Building stand as reminders of that shared commitment to education in Lopez, Quezon.",
        options: [
          { label: "Tell me about your vision.", next: 2 },
          { label: "Anything else?", next: 0 },
          { label: "Thank you!", next: null },
        ],
      },
      {
        message:
          "As an Iskolar ng Bayan, carry yourself with discipline and purpose. PUP Lopez is here for every deserving student who wants to build a better future. Develop your leadership, embrace national service, and live by our INSPIRED values — Integrity, Nationalism, Sense of Service, Passion for Learning, Inclusivity, Respect, Excellence, and Democracy. Whether in the classroom, in ROTC, or in our extension programs, strive to be someone your community and country can depend on.",
        options: [
          { label: "Anything else?", next: 0 },
          { label: "Thank you, Director!", next: null },
        ],
      },
      {
        message:
          "Walk-in visitors are welcome at our campus along Yumul Street, Brgy. Burgos, Lopez, Quezon. Office hours are Monday to Friday, 8:00 AM to 5:00 PM, and Saturday 8:00 AM to 5:00 PM for limited offices only — we are closed on Sundays. Some offices pause during lunch break, usually 12:00 NN to 1:00 PM. For group tours or official visits, please contact us in advance at lopez@pup.edu.ph or call (042) 302-5249, (042) 841-1149, or (042) 841-1890. You may also reach us through the PUP trunk line at +63 2 5335-1787. Use the destination pins in this virtual tour to find the Administration Building and my office. Maraming salamat for visiting PUP Lopez!",
        options: [
          { label: "Anything else?", next: 0 },
          { label: "Goodbye!", next: null },
        ],
      },
      {
        message:
          "As Lieutenant Colonel (Infantry) of the Philippine Army Reserve, I remain active in military science education — including instruction related to the Reserve Officers' Training Corps (ROTC) and General Military Subjects for Military Science courses. This dual path in education and defense service allows me to promote leadership development and national service among our students. True leadership is not just rank — it is character, duty, and service to the Filipino people.",
        options: [
          { label: "Any message for students?", next: 6 },
          { label: "Anything else?", next: 0 },
          { label: "Thank you, Colonel!", next: null },
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
        voiceProfile={npc.voiceProfile}
        voicePitch={npc.voicePitch}
        voiceRate={npc.voiceRate}
      />
    ))}
  </>
);

export default NPCs;
