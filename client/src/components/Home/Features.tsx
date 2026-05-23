import { MapPin, UserCircle, Map, Navigation, Info, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: MapPin,
    title: "Interactive 3D Campus",
    description:
      "Fully modeled 3D representation of PUP Lopez. Explore buildings and walk through an immersive environment.",
    color: "bg-[#FFD700]",
  },
  {
    icon: UserCircle,
    title: "Playable Tour Guide",
    description:
      "Toggle between first and third-person views with a customizable character leading your journey.",
    color: "bg-[#800000]",
  },
  {
    icon: Map,
    title: "Mini-Map Navigation",
    description:
      "Real-time position tracking with clickable teleportation icons and pinned destinations.",
    color: "bg-white",
  },
  {
    icon: Navigation,
    title: "Guided Wayfinding",
    description:
      "Dynamic arrow guides and distance meters help you find any building with precision.",
    color: "bg-white",
  },
  {
    icon: Info,
    title: "Area Detection",
    description:
      "Automatic landmark identification. The system displays building names as you approach them.",
    color: "bg-[#800000]",
  },
  {
    icon: MessageSquare,
    title: "NPC Dialog System",
    description:
      "Interact with characters across campus to receive helpful information and instructions.",
    color: "bg-[#FFD700]",
  },
];

export function Features() {
  return (
    <section
      className="relative overflow-hidden bg-[#FFFDF5] px-4 py-16 sm:px-6 sm:py-20 lg:px-12 lg:py-24 xl:px-20"
      id="features"
    >
      <div className="container relative z-10 mx-auto">
        <div className="mb-10 flex flex-col items-center sm:mb-12 lg:mb-14">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-[#800000] italic sm:mb-4 sm:text-sm"
          >
            Capabilities
          </motion.span>
          <h2 className="text-center text-3xl font-black leading-tight text-black sm:text-4xl md:text-5xl lg:text-6xl">
            BUILT FOR <br />
            <span className="relative text-[#800000]">
              EXPLORATION
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
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isMaroon = feature.color === "bg-[#800000]";

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ y: -6, x: -4 }}
                className="group relative rounded-2xl border-2 border-black bg-white p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:shadow-[10px_10px_0px_0px_rgba(128,0,0,1)] sm:rounded-3xl sm:border-4 sm:p-6 lg:p-7"
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-transform group-hover:rotate-6 sm:mb-5 sm:h-14 sm:w-14 sm:rounded-2xl sm:border-4 ${feature.color}`}
                >
                  <Icon
                    className={`h-6 w-6 sm:h-7 sm:w-7 ${isMaroon ? "text-white" : "text-black"}`}
                  />
                </div>

                <h3 className="mb-2 text-lg font-black uppercase tracking-tighter text-black sm:mb-3 sm:text-xl">
                  {feature.title}
                </h3>

                <p className="text-sm font-bold leading-relaxed text-black/70 sm:text-base">
                  {feature.description}
                </p>

                <div className="absolute top-0 right-0 h-6 w-6 rounded-bl-xl border-b-2 border-l-2 border-black bg-[#FFFDF5] sm:h-8 sm:w-8 sm:rounded-bl-2xl sm:border-b-4 sm:border-l-4" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
