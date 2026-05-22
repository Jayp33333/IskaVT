import { MapPin, UserCircle, Map, Navigation, Info, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { 
    icon: MapPin, 
    title: "Interactive 3D Campus", 
    description: "Fully modeled 3D representation of PUP Lopez. Explore buildings and walk through an immersive environment.",
    color: "bg-[#FFD700]" // Yellow accent
  },
  { 
    icon: UserCircle, 
    title: "Playable Tour Guide", 
    description: "Toggle between first and third-person views with a customizable character leading your journey.",
    color: "bg-[#800000]" // Maroon accent
  },
  { 
    icon: Map, 
    title: "Mini-Map Navigation", 
    description: "Real-time position tracking with clickable teleportation icons and pinned destinations.",
    color: "bg-white" 
  },
  { 
    icon: Navigation, 
    title: "Guided Wayfinding", 
    description: "Dynamic arrow guides and distance meters help you find any building with precision.",
    color: "bg-white"
  },
  { 
    icon: Info, 
    title: "Area Detection", 
    description: "Automatic landmark identification. The system displays building names as you approach them.",
    color: "bg-[#800000]"
  },
  { 
    icon: MessageSquare, 
    title: "NPC Dialog System", 
    description: "Interact with characters across campus to receive helpful information and instructions.",
    color: "bg-[#FFD700]"
  },
];

export function Features() {
  return (
    <section className="py-32 px-6 lg:px-20 bg-[#FFFDF5] relative overflow-hidden" id="features">

      <div className="container mx-auto relative z-10">
        <div className="flex flex-col items-center mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-[#800000] font-black uppercase tracking-[0.2em] text-sm mb-4 italic"
          >
            Capabilities
          </motion.span>
          <h2 className="text-5xl md:text-7xl font-black text-black text-center leading-tight">
            BUILT FOR <br />
            <span className="text-[#800000] relative">
              EXPLORATION
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 20" fill="none">
                <path d="M5 15Q150 5 295 15" stroke="#FFD700" strokeWidth="8" strokeLinecap="round"/>
              </svg>
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isMaroon = feature.color === "bg-[#800000]";
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, x: -5 }}
                className="group relative bg-white border-4 border-black p-8 rounded-4xl
                           shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(128,0,0,1)] 
                           transition-all duration-300"
              >
                {/* Icon Container */}
                <div className={`w-16 h-16 rounded-2xl border-4 border-black mb-6 flex items-center justify-center 
                                ${feature.color} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
                                group-hover:rotate-6 transition-transform`}>
                  <Icon className={`w-8 h-8 ${isMaroon ? 'text-white' : 'text-black'}`} />
                </div>

                <h3 className="text-2xl font-black text-black mb-4 uppercase tracking-tighter">
                  {feature.title}
                </h3>
                
                <p className="text-black/70 font-bold leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative Slanted Corner (Futuristic Detail) */}
                <div className="absolute top-0 right-0 w-8 h-8 bg-[#FFFDF5] border-b-4 border-l-4 border-black rounded-bl-2xl" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}