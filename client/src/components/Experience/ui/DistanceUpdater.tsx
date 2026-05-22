import { useFrame } from "@react-three/fiber";
import useWorld from "../../../hooks/useWorld";

const DistanceUpdater = () => {
  const characterPosition = useWorld((s: any) => s.characterPosition);
  const pinPosition = useWorld((s: any) => s.pinPosition);
  const setDistance = useWorld((s: any) => s.setDistance);

  useFrame(() => {
    if (characterPosition && pinPosition) {
      const dx = pinPosition.x - characterPosition.x;
      const dy = pinPosition.y - characterPosition.y;
      const dz = pinPosition.z - characterPosition.z;
      setDistance(Math.hypot(dx, dy, dz));
    }
  });

  return null;
};

export default DistanceUpdater;
