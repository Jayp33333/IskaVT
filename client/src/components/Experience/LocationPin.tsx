import { Billboard, Html } from "@react-three/drei";
import * as THREE from "three";
import { IoLocationSharp } from "react-icons/io5";

interface LocationPinProps {
  position: THREE.Vector3;
  label?: string;
  highlighted?: boolean;
  onClick?: () => void;
}

export function LocationPin({
  position,
  label,
  highlighted = false,
  onClick,
}: LocationPinProps) {
  // Requested UI: single big yellow location icon (no duplicate/extra pin shape)
  const pinColor = "#ffd700";
  const iconSize = highlighted ? 38 : 34;

  return (
    <Billboard position={[position.x, position.y + 0.3, position.z]}>
      <Html center>
        <div
          role={onClick ? "button" : undefined}
          tabIndex={onClick ? 0 : undefined}
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
          onKeyDown={(e) => {
            if (!onClick) return;
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              onClick();
            }
          }}
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            filter: "drop-shadow(2px 2px 3px rgba(0, 0, 0, 0.3))",
            cursor: onClick ? "pointer" : "default",
            transform: "translateZ(0)",
          }}
        >
          {/* Single location icon */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              pointerEvents: "none",
              color: pinColor,
              filter:
                "drop-shadow(0 2px 2px rgba(0,0,0,0.35)) drop-shadow(0 0 6px rgba(255,215,0,0.35))",
            }}
          >
            <IoLocationSharp size={iconSize} />
          </div>

          {/* Label */}
          {label && (
            <div
              style={{
                position: "absolute",
                top: `${iconSize + 6}px`,
                left: "50%",
                transform: "translateX(-50%)",
                whiteSpace: "nowrap",
                fontSize: "11px",
                fontWeight: "500",
                color: "#000000",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                padding: "2px 6px",
                borderRadius: "4px",
                border: "1px solid rgba(0, 0, 0, 0.1)",
                pointerEvents: "none",
                zIndex: 2,
              }}
            >
              {label}
            </div>
          )}
        </div>
      </Html>
    </Billboard>
  );
}
