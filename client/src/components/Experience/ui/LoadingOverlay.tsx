import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";
import { SectionDotGrid } from "../../marketing/SectionDotGrid";

export default function LoadingOverlay({
  onFinished,
}: {
  onFinished: () => void;
}) {
  const { progress } = useProgress();
  const [done, setDone] = useState(false);
  const [visible, setVisible] = useState(true);
  const [opacity, setOpacity] = useState(1);

  const logo = "/images/iska-logo.png";

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
      className={`absolute inset-0 z-[9999] flex flex-col justify-center items-center bg-[#FFF5F5] transition-opacity duration-500 ease-in-out
      ${
        opacity === 0
          ? "opacity-0 pointer-events-none"
          : "opacity-100 pointer-events-auto"
      }`}
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <SectionDotGrid tone="light" />
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-red-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-200 rounded-full blur-3xl opacity-50" />
      </div>

      {/* Content */}
      <div className="relative flex flex-col items-center">
        {/* Logo */}
        <div className="flex justify-center items-center mb-6 sm:mb-8 md:mb-10 px-4">
          <img
            src={logo}
            alt="ISKA Logo"
            className="h-10 w-auto max-w-[min(72vw,12rem)] sm:h-14 sm:max-w-none md:h-16 lg:h-20 drop-shadow-[4px_4px_0px_rgba(0,0,0,0.05)]"
          />
        </div>

        {/* Waving dots */}
        <div className="flex items-end justify-center gap-2.5 h-8">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block h-3.5 w-3.5 rounded-full bg-[#9b1c1c] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] loading-dot-wave"
              style={{ animationDelay: `${i * 0.18}s` }}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 font-black text-black/20 text-[10px] tracking-[0.3em] uppercase">
        Loading Assets
      </div>
    </div>
  );
}