import { MapPin, UserCircle, Navigation, Info, Map, Compass } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: MapPin, title: "Interactive 3D Campus", description: "Explore the campus in full 3D for a realistic experience." },
  { icon: UserCircle, title: "Character Tour Guide", description: "A virtual guide to walk you through key locations." },
  { icon: Navigation, title: "Choose Your Destination", description: "Select any location and teleport instantly." },
  { icon: Info, title: "Information on Landmarks", description: "Get details about landmarks and facilities." },
  { icon: Map, title: "Mini-Map Navigation", description: "Easily navigate using a handy mini-map." },
  { icon: Compass, title: "Free Exploration Mode", description: "Wander around freely and discover hidden spots." },
];

export function Features() {
  return (
    <section className="py-24 px-4 sm:px-8 md:px-10 lg:px-28" id="features">
      <div className="container mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl mb-12 text-[#800000] font-bold text-center">
          Key Features
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                className="bg-white rounded-2xl border border-gray-200  p-8 flex flex-col items-start text-left transition-transform duration-300 hover:shadow-sm hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center bg-linear-to-br from-[#ffe5e5] to-[#fff0f0] mb-4">
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#b34747]" />
                </div>
                <h3 className="text-xl font-semibold text-[#800000] mb-2">
                  {feature.title}
                </h3>
                <p className="text-base text-[#800000]">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
