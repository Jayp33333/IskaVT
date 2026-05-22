import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Hero() {
  const navigate = useNavigate();
  return (
    <section
      className="relative min-h-screen bg-[#FFFDF5] overflow-hidden flex items-center px-5 pb-12 pt-28 sm:px-6 sm:pt-24 lg:px-12 lg:pt-24 xl:px-20"
      id="home"
    >
      {/* Background Blur */}
      <div className="absolute bottom-20 left-[40%]">
        <div className="w-24 h-24 bg-[#800000]/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(340px,1.1fr)] lg:gap-12 xl:gap-16">
        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="z-10 max-w-3xl"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#FFD700] border-4 border-black px-4 py-1 rounded-full mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Sparkles className="w-4 h-4 text-black" />
            <span className="text-black font-bold text-sm uppercase tracking-wider italic">
              New Experience
            </span>
          </div>

          {/* Heading */}
          <h1 className="mb-6 text-5xl font-black leading-[0.9] text-black sm:text-6xl md:text-7xl xl:text-8xl">
            EXPLORE <br />
            <span className="text-[#800000]">PUP LOPEZ</span> <br />
            <span className="relative inline-block">
              IN 3D
              {/* Yellow Underline */}
              <svg
                className="absolute -bottom-2 left-0 w-full"
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

          {/* Description */}
          <p className="mb-8 max-w-lg text-lg font-medium leading-relaxed text-black/70 sm:text-xl">
            Step into a vibrant virtual world. Navigate campus buildings,
            interact with AI guides, and discover facilities in a playful,
            immersive 3D environment.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-6">
            {/* Primary */}
            <button
              onClick={() => navigate("/experience")}
              className="group relative bg-[#800000] border-4 border-black px-8 py-4 rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              <div className="flex items-center gap-3 text-white font-black text-xl uppercase tracking-tighter">
                Start Tour
                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </div>

              {/* Slanted Corner */}
              <div className="absolute top-0 right-0 w-4 h-4 bg-[#FFFDF5] border-b-4 border-l-4 border-black rounded-bl-xl" />
            </button>

            {/* Secondary */}
            <button className="border-4 border-black px-8 py-4 rounded-xl font-black text-xl uppercase tracking-tighter hover:bg-black hover:text-white transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
              View Map
            </button>
          </div>
        </motion.div>

        {/* RIGHT CONTENT */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mx-auto w-full max-w-2xl lg:mx-0"
        >
          {/* MAIN IMAGE CONTAINER */}
          <div className="relative z-10 overflow-visible rounded-[32px] border-4 border-black bg-white p-3 shadow-[10px_10px_0px_0px_rgba(128,0,0,1)] sm:rounded-[40px] sm:p-4 sm:shadow-[16px_16px_0px_0px_rgba(128,0,0,1)]">
            {/* Image */}
            <div className="aspect-video overflow-hidden rounded-[24px] border-4 border-black bg-[#F5F5F5] sm:rounded-[30px]">
              <img
                src="/images/campus-renderer.png"
                alt="3D Campus Preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* LOCATION CARD */}
          <div className="absolute -bottom-6 left-2 z-20 rounded-2xl border-4 border-black bg-white p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:-left-10">
            <div className="flex items-center gap-3">
              {/* PUP LOGO */}
              <div className="w-8 h-8 bg-white border- rounded-xl overflow-hidden flex items-center justify-center">
                <img
                  src="/images/pup-logo.png"
                  alt="PUP Logo"
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="font-black text-sm">PUP Lopez Campus</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
