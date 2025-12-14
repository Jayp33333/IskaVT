  import { useEffect, useState } from "react";
  import { IoLocationSharp } from "react-icons/io5";
  import useWorld from "../../hooks/useWorld";

export const MiniMapEdgePin = ({ radius = 90 }) => {
  const character = useWorld((s: any) => s.characterPosition);
  const pin = useWorld((s: any) => s.pinPosition);
  const isPinConfirmed = useWorld((s: any) => s.isPinConfirmed);
  const cameraRotation = useWorld((s: any) => s.cameraRotation);

  const [pos, setPos] = useState({ x: 10, y: 50, angle: 90 });
  const threshold = 5.2; // hide edge pin when closer than 10m

  useEffect(() => {
    if (!character || !pin || !isPinConfirmed) return;

    const dx = pin.x - character.x;
    const dz = pin.z - character.z;
    const distance = Math.sqrt(dx * dx + dz * dz);

    // hide edge pin if character is close
    if (distance < threshold) return;

    const angleToPin = Math.atan2(dz, dx);

    const x = Math.cos(angleToPin) * radius;
    const y = -Math.sin(angleToPin) * radius;

    setPos({
      x,
      y,
      angle: angleToPin - cameraRotation.y,
    });
  }, [character, pin, isPinConfirmed, cameraRotation, radius]);

  // hide pin if too close
  if (!pin || !isPinConfirmed) return null;

  const dx = pin.x - (character?.x || 0);
  const dz = pin.z - (character?.z || 0);
  const distance = Math.sqrt(dx * dx + dz * dz);
  if (distance < threshold) return null;

  return (
    <div
      style={{
        position: "fixed",
        width: "20vw",
        maxWidth: "200px",
        height: "20vw",
        maxHeight: "200px",
        top: "2%",
        right: "2%",
        pointerEvents: "none",
        zIndex: 500,
      }}
    >
      <IoLocationSharp
        style={{
          position: "absolute",
          left: `calc(50% + ${pos.x}px)`,
          top: `calc(50% - ${pos.y}px)`,
          width: "24px",
          height: "24px",
          transform: `translate(-50%, -50%)`,
          filter: "drop-shadow(0 0 5px black)",
          color: "red",
        }}
      />
    </div>
  );
};
