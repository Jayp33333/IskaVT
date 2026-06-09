import useWorld from "../../hooks/useWorld";
import { ArrowGuide } from "./ui/ArrowGuide";
import { WaypointMarker } from "./ui/WaypointMarker";

const Pin = () => {
  const pinPosition = useWorld((s: any) => s.pinPosition);

  return (
    <>
      <WaypointMarker position={pinPosition} />
      <ArrowGuide />
    </>
  );
};

export default Pin;
