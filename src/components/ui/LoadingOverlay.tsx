import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";

export default function LoadingOverlay() {
  const { progress } = useProgress();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => setHidden(true), 500); // smooth fade-out
    }
  }, [progress]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: hidden ? "none" : "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "black",
        color: "white",
        fontSize: "30px",
        zIndex: 9999,
        transition: "opacity .5s",
      }}
    >
      Loading... {progress.toFixed(0)}%
    </div>
  );
}
