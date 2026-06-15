const FOG_COLOR = "#b8cce0";
const FOG_NEAR = 30;
const FOG_FAR = 85;

const SceneFog = () => (
  <fog attach="fog" args={[FOG_COLOR, FOG_NEAR, FOG_FAR]} />
);

export default SceneFog;
