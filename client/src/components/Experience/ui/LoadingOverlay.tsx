import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";

export default function LoadingOverlay({ onFinished }: { onFinished: () => void }) {
  const { progress } = useProgress();
  const [done, setDone] = useState(false);
  const [visible, setVisible] = useState(true);
  const [opacity, setOpacity] = useState(1);

  const logo = "/images/iska-logo.png"; // Main logo
  const profileIcon = "/images/iska-profile.png"; // Moving icon on progress bar

  useEffect(() => {
    if (progress === 100 && !done) {
      const finishTimeout = setTimeout(() => {
        onFinished();
        setDone(true);
      }, 500);

      const fadeTimeout = setTimeout(() => setOpacity(0), 300);
      const hideTimeout = setTimeout(() => setVisible(false), 800);

      return () => {
        clearTimeout(finishTimeout);
        clearTimeout(fadeTimeout);
        clearTimeout(hideTimeout);
      };
    }
  }, [progress, done, onFinished]);

  if (!visible) return null;

  return (
    <div
      className={`absolute inset-0 z-9999 flex flex-col justify-center items-center bg-white transition-opacity duration-500 ease-in-out
      ${opacity === 0 ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"}
`}
      style={{ padding: "clamp(20px, 5vw, 40px)" }}
    >
      {/* Center Logo */}
      <img
        src={logo}
        alt="ISKA Logo"
        className="h-14 sm:h-16 md:h-18 mb-10"
      />

      {/* Progress Bar with Moving Icon */}
      <div className="relative w-60 h-2 sm:h-3 rounded-full bg-white/15">
        {/* Moving profile icon */}
        <img
          src={profileIcon}
          alt="Loading Icon"
          className="
              absolute bottom-0 w-7 h-7 sm:w-8 sm:h-8
              rounded-full bg-[#111] p-0.5
              shadow-[0_0_10px_rgba(155,28,28,0.9)]
              transition-all duration-300 ease-in-out
              z-10
            "
            style={{
              left: `calc(${progress}% - 14px)`,
            }} // moves along the bar
        />

        {/* Progress fill */}
        <div
          className="h-full rounded-full bg-linear-to-r from-[#6b0000] to-[#9b1c1c] transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Percentage */}
      <div className="mt-2 text-xs sm:text-sm text-[#800000] font-bold">
        {progress.toFixed(0)}%
      </div>
    </div>
  );
}
