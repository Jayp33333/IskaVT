import { NPC } from "./NPC";

const NPCs = () => (
  <>
    <NPC
      position={[12, 0, 1]}
      model="./models/avatars/guard.glb"
      name="Guard"
      scale={1.1}
      rotation={[0, -Math.PI / 2, 0]}
    />
  </>
);

export default NPCs;
