import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";

export default function LoadingOverlay({ onFinished }: { onFinished: () => void }) {
  const { progress } = useProgress();
  const [ done, setDone ] = useState(false);
  const [visible, setVisible] = useState(true);
  const [opacity, setOpacity] = useState(1);
  const [messageIndex, setMessageIndex] = useState(0);

  const loadingIcon = "/images/iska-profile.png";
  const pupLogo = "/images/pup-logo.png";

  const messages = [
    "Preparing Campus Map…",
    "Loading Buildings & Facilities…",
    "Optimizing 3D Experience…",
    "Setting Up Navigation…",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100 && !done) {
      const welcomeMessage = setTimeout(() => {onFinished(), setDone(true)}, 1000);
      const fadeTimeout = setTimeout(() => setOpacity(0), 300);
      const hideTimeout = setTimeout(() => setVisible(false), 800);
      return () => {
        clearTimeout(welcomeMessage);
        clearTimeout(fadeTimeout);
        clearTimeout(hideTimeout);
      };
    }
  }, [progress, done, onFinished]);

  if (!visible) return null;

  return (
    <div
      className={`absolute inset-0 z-9999 flex flex-col justify-between bg-[#111] text-white
      transition-opacity duration-500 ease-in-out font-sans
      ${opacity === 0 ? "opacity-0" : "opacity-100"}`}
      style={{ padding: "clamp(20px, 5vw, 40px) 0 clamp(40px, 10vw, 80px)" }}
    >
      {/* ===== TOP ===== */}
      <div className="flex flex-col items-center px-4">
        <img
          src={pupLogo}
          alt="PUP Logo"
          className="w-[120px] sm:w-40 md:w-[200px] mb-3"
        />

        <h1
          className="
            bebas-neue-regular
            text-[#9b1c1c]
            text-center
            tracking-widest
            text-[28px]
            sm:text-[36px]
            md:text-[44px]
            lg:text-[50px]
          "
        >
          ISKA 3D CAMPUS TOUR
        </h1>
      </div>

      {/* ===== BOTTOM ===== */}
      <div className="flex flex-col items-center px-4">
        {/* Message */}
        <div className="mb-4 text-center text-sm sm:text-base md:text-lg opacity-90">
          {progress < 90 ? messages[messageIndex] : "Entering Campus…"}
        </div>

        {/* Progress Container */}
        <div className="relative w-full max-w-[300px] h-10">
          {/* Moving Icon */}
          <img
            src={loadingIcon}
            alt="Loading Icon"
            className="
              absolute top-0 w-7 h-7 sm:w-8 sm:h-8
              rounded-full bg-[#111] p-0.5
              shadow-[0_0_10px_rgba(155,28,28,0.9)]
              transition-all duration-300 ease-in-out
              z-10
            "
            style={{
              left: `calc(${progress}% - 14px)`,
            }}
          />

          {/* Progress Bar */}
          <div className="absolute bottom-0 w-full h-2 sm:h-2.5 rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-linear-to-r from-[#6b0000] to-[#9b1c1c]
              transition-all duration-300 ease-in-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Percentage */}
        <div className="mt-2 text-xs sm:text-sm opacity-75">
          {progress.toFixed(0)}%
        </div>
      </div>
    </div>
  );
}
