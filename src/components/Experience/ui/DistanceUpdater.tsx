import { useFrame } from "@react-three/fiber";
import useWorld from "../../../hooks/useWorld";

const DistanceUpdater = () => {
  const characterPosition = useWorld((s: any) => s.characterPosition);
  const pinPosition = useWorld((s: any) => s.pinPosition);
  const setDistance = useWorld((s: any) => s.setDistance);

  useFrame(() => {
    if (characterPosition && pinPosition) {
      setDistance(characterPosition.distanceTo(pinPosition));
    }
  });

  return null;
};

export default DistanceUpdater;
