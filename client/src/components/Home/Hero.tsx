import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CampusMapDialog } from "./CampusMapDialog";
import { HeroNeoBackground } from "./HeroNeoBackground";

export function Hero() {
  const navigate = useNavigate();
  const [mapOpen, setMapOpen] = useState(false);
  return (
    <section
      className="relative flex min-h-[calc(100dvh-3.5rem)] flex-col justify-center overflow-x-hidden bg-cream px-4 pb-16 pt-20 sm:min-h-[calc(100dvh-4rem)] sm:px-6 sm:pb-12 sm:pt-24 lg:min-h-[calc(100dvh-4.5rem)] lg:items-center lg:px-12 lg:pt-24 xl:min-h-[calc(100dvh-5rem)] xl:px-20"
      id="home"
    >
      <HeroNeoBackground />

      <div className="container relative z-10 mx-auto grid grid-cols-1 justify-items-center gap-6 sm:gap-8 lg:grid-cols-2 lg:items-center lg:justify-items-stretch lg:gap-10 xl:gap-14">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="z-10 flex w-full max-w-2xl flex-col items-center text-center lg:max-w-3xl lg:items-start lg:text-left"
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

          <p className="mb-6 max-w-md text-sm font-medium leading-relaxed text-ink/70 sm:mb-7 sm:max-w-lg sm:text-base lg:mx-0">
            Walk through{" "}
            <span className="font-black text-ink">buildings</span>, locate{" "}
            <span className="font-black text-ink">offices</span> and{" "}
            <span className="font-black text-ink">facilities</span>, and plan
            your visit before you arrive on campus.
          </p>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:justify-start">
            <button
              type="button"
              onClick={() => navigate("/experience")}
              className="group inline-flex items-center gap-2 rounded-xl border-4 border-ink bg-maroon px-5 py-2.5 text-sm font-black uppercase tracking-tighter text-white transition-colors hover:bg-maroon/90 sm:gap-3 sm:px-6 sm:py-3 sm:text-base md:text-lg"
            >
              Start Tour
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
            </button>

            <button
              type="button"
              onClick={() => setMapOpen(true)}
              className="rounded-xl border-4 border-ink bg-cream px-5 py-2.5 text-sm font-black uppercase tracking-tighter transition-colors hover:bg-ink hover:text-white sm:px-6 sm:py-3 sm:text-base md:text-lg"
            >
              View Map
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 hidden w-full shrink-0 pb-12 sm:pb-14 lg:flex lg:max-w-[min(100%,32rem)] lg:justify-self-end xl:max-w-[min(100%,36rem)]"
        >
          <img
            src="/images/Pylon_icon.png"
            alt="PUP Lopez campus pylon"
            className="mx-auto h-auto w-full max-w-[15rem] object-contain sm:max-w-[18rem] md:max-w-[22rem] lg:max-w-full"
          />

          <div className="absolute bottom-0 left-1/2 z-10 flex -translate-x-1/2 items-center justify-center gap-2 rounded-xl border-2 border-ink bg-white px-3 py-2 shadow-brutal-sm sm:gap-3 sm:rounded-2xl sm:border-4 sm:px-4 sm:py-2.5">
            <img
              src="/images/iska-head-icon.png"
              alt="Iska"
              className="h-10 w-10 object-contain sm:h-11 sm:w-11"
            />
            <img
              src="/images/pup-logo.png"
              alt="Polytechnic University of the Philippines"
              className="h-11 w-11 object-contain sm:h-12 sm:w-12"
            />
            <img
              src="/images/isko-head-icon.png"
              alt="Isko"
              className="h-10 w-10 object-contain sm:h-11 sm:w-11"
            />
          </div>
        </motion.div>
      </div>

      <CampusMapDialog open={mapOpen} onClose={() => setMapOpen(false)} />
    </section>
  );
}
