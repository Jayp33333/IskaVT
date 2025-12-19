import { useEffect, useRef, useState } from "react";
import { IoLocationSharp } from "react-icons/io5";
import useWorld from "../../../hooks/useWorld";

export const MiniMapEdgePin = () => {
  const character = useWorld((s: any) => s.characterPosition);
  const pin = useWorld((s: any) => s.pinPosition);
  const isPinConfirmed = useWorld((s: any) => s.isPinConfirmed);
  const cameraRotation = useWorld((s: any) => s.cameraRotation);

  const mapRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0, angle: 0 });

  const threshold = 11.3;

  useEffect(() => {
    if (!character || !pin || !isPinConfirmed || !mapRef.current) return;

    const dx = pin.x - character.x;
    const dz = pin.z - character.z;
    const distance = Math.sqrt(dx * dx + dz * dz);

    if (distance < threshold) return;

    const rect = mapRef.current.getBoundingClientRect();

    const radius = Math.min(rect.width, rect.height) / 2 - 14;

    const angleToPin = Math.atan2(dz, dx);

    const x = Math.cos(angleToPin) * radius;
    const y = -Math.sin(angleToPin) * radius;

    setPos({
      x,
      y,
      angle: angleToPin - cameraRotation.y,
    });
  }, [character, pin, isPinConfirmed, cameraRotation]);

  if (!pin || !isPinConfirmed) return null;

  const dx = pin.x - (character?.x || 0);
  const dz = pin.z - (character?.z || 0);
  const distance = Math.sqrt(dx * dx + dz * dz);
  if (distance < threshold) return null;

  return (
    <div
      ref={mapRef}
      className="fixed top-[2%] right-[2%] z-500 w-[30vh] max-w-[200px] h-[30vh] max-h-[200px] pointer-events-none rounded-full"
    >
      <IoLocationSharp
        className="absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-red-600 drop-shadow-lg"
        style={{
          left: `calc(50% + ${pos.x}px)`,
          top: `calc(50% - ${pos.y}px)`,
        }}
      />
    </div>
  );
};
