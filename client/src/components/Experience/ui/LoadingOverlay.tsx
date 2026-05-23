import { useEffect, useState } from "react";

export default function LoadingOverlay({
  progress,
  isComplete,
  onFinished,
}: {
  progress: number;
  isComplete: boolean;
  onFinished: () => void;
}) {
  const [done, setDone] = useState(false);
  const [visible, setVisible] = useState(true);
  const [opacity, setOpacity] = useState(1);

  const logo = "/images/iska-logo.png";
  const displayProgress = Number.isFinite(progress)
    ? Math.min(100, Math.max(0, progress))
    : 0;

  useEffect(() => {
    if (isComplete && !done) {
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
  }, [isComplete, done, onFinished]);

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
      {/* Soft Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-red-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-200 rounded-full blur-3xl opacity-50" />
      </div>

      {/* Content */}
      <div className="relative flex flex-col items-center">
        {/* Logo */}
        <div className="flex justify-center items-center mb-10">
          <img
            src={logo}
            alt="ISKA Logo"
            className="h-16 sm:h-20 drop-shadow-[4px_4px_0px_rgba(0,0,0,0.05)]"
          />
        </div>

        {/* Progress Bar */}
        <div className="relative w-64 h-8 bg-white border-4 border-black rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div
            className="h-full bg-[#9b1c1c] transition-all duration-300 ease-out"
            style={{
              width: `${displayProgress}%`,
              backgroundImage:
                "linear-gradient(45deg, rgba(255,255,255,0.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.2) 75%, transparent 75%, transparent)",
              backgroundSize: "30px 30px",
            }}
          />
        </div>

        {/* Percentage */}
        <div className="mt-6">
          <span className="text-[#9b1c1c] font-black text-lg tracking-tight italic">
            {displayProgress}%
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 font-black text-black/20 text-[10px] tracking-[0.3em] uppercase">
        Loading Assets
      </div>
    </div>
  );
}