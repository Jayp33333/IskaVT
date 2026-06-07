import { useFrame } from "@react-three/fiber";
import useWorld from "../../../hooks/useWorld";
import { computeGuideDistance } from "../../../data/guidePaths";

const DistanceUpdater = () => {
  const characterPosition = useWorld((s: any) => s.characterPosition);
  const pinPosition = useWorld((s: any) => s.pinPosition);
  const selectedDestinationId = useWorld((s: any) => s.selectedDestinationId);
  const setDistance = useWorld((s: any) => s.setDistance);

  useFrame(() => {
    if (characterPosition && pinPosition) {
      setDistance(
        computeGuideDistance(characterPosition, pinPosition, selectedDestinationId),
      );
    }
  });

  return null;
};

export default DistanceUpdater;
