import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CampusMapDialog } from "./CampusMapDialog";

export function Hero() {
  const navigate = useNavigate();
  const [mapOpen, setMapOpen] = useState(false);
  return (
    <section
      className="relative flex min-h-[calc(100vh-5rem)] items-center overflow-hidden bg-cream px-4 pb-10 pt-24 sm:min-h-screen sm:px-6 sm:pb-12 sm:pt-28 lg:px-12 lg:pt-24 xl:px-20"
      id="home"
    >
      <div className="absolute bottom-16 left-[35%] sm:bottom-20 sm:left-[40%]">
        <div className="h-20 w-20 rounded-full bg-[#800000]/5 blur-3xl sm:h-24 sm:w-24" />
      </div>

      <div className="container mx-auto grid grid-cols-1 items-center gap-8 sm:gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(300px,1.1fr)] lg:gap-12 xl:gap-14">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="z-10 max-w-2xl lg:max-w-3xl"
        >
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-[#FFD700] px-3 py-1 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:mb-5 sm:gap-2 sm:border-4 sm:px-4">
            <Sparkles className="h-3.5 w-3.5 text-black sm:h-4 sm:w-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-black italic sm:text-xs">
              New Experience
            </span>
          </div>

          <h1 className="mb-4 text-4xl font-black leading-[0.92] text-black sm:mb-5 sm:text-5xl md:text-6xl lg:text-7xl">
            EXPLORE <br />
            <span className="text-[#800000]">PUP LOPEZ</span> <br />
            <span className="relative inline-block">
              IN 3D
              <svg
                className="absolute -bottom-1 left-0 w-full sm:-bottom-2"
                viewBox="0 0 300 20"
                fill="none"
              >
                <path
                  d="M5 15Q150 5 295 15"
                  stroke="#FFD700"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="mb-6 max-w-md text-sm font-medium leading-relaxed text-ink/70 sm:mb-7 sm:max-w-lg sm:text-base">
            Walk through buildings, locate offices and facilities, and plan
            your visit before you arrive on campus.
          </p>

          <div className="flex flex-wrap gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => navigate("/experience")}
              className="group relative rounded-lg border-2 border-black bg-[#800000] px-5 py-2.5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none sm:rounded-xl sm:border-4 sm:px-6 sm:py-3"
            >
              <div className="flex items-center gap-2 text-sm font-black uppercase tracking-tighter text-white sm:gap-3 sm:text-base md:text-lg">
                Start Tour
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
              </div>
              <div className="absolute top-0 right-0 h-3 w-3 rounded-bl-lg border-b-2 border-l-2 border-black bg-cream sm:h-4 sm:w-4 sm:rounded-bl-xl sm:border-b-4 sm:border-l-4" />
            </button>

            <button
              type="button"
              onClick={() => setMapOpen(true)}
              className="rounded-lg border-2 border-black px-5 py-2.5 text-sm font-black uppercase tracking-tighter shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] transition-colors hover:bg-black hover:text-white sm:rounded-xl sm:border-4 sm:px-6 sm:py-3 sm:text-base md:text-lg"
            >
              View Map
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mx-auto w-full max-w-xl sm:max-w-2xl lg:mx-0"
        >
          <div className="relative z-10 overflow-visible rounded-2xl border-2 border-black bg-white p-2 shadow-[8px_8px_0px_0px_rgba(128,0,0,1)] sm:rounded-[32px] sm:border-4 sm:p-3 md:rounded-[40px] md:p-4 md:shadow-[12px_12px_0px_0px_rgba(128,0,0,1)]">
            <div className="aspect-video overflow-hidden rounded-xl border-2 border-black bg-[#F5F5F5] sm:rounded-[24px] sm:border-4 md:rounded-[30px]">
              <img
                src="/images/campus-renderer.png"
                alt="3D Campus Preview"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="absolute -bottom-4 left-1 z-20 rounded-xl border-2 border-black bg-white p-2.5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] sm:-bottom-5 sm:left-2 sm:rounded-2xl sm:border-4 sm:p-3 md:-left-8">
            <div className="flex items-center gap-2 sm:gap-3">
              <img
                src="/images/pup-logo.png"
                alt="PUP Logo"
                className="h-6 w-6 object-contain sm:h-7 sm:w-7"
              />
              <p className="text-xs font-black sm:text-sm">PUP Lopez Campus</p>
            </div>
          </div>
        </motion.div>
      </div>

      <CampusMapDialog open={mapOpen} onClose={() => setMapOpen(false)} />
    </section>
  );
}
