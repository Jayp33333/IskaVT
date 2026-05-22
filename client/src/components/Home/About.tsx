import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, Zap, Heart } from 'lucide-react';

export function About() {
  return (
    <section className="py-32 px-6 lg:px-20 bg-[#FFFDF5] relative overflow-hidden" id="about">
      
      {/* Background abstract blob */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#FFD700]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          
          {/* --- LEFT: Playful Layered Visual --- */}
          <div className="relative w-full lg:w-1/2 flex justify-center">
            {/* The "Main" Image Container */}
            <motion.div 
              initial={{ rotate: -2 }}
              whileInView={{ rotate: 0 }}
              className="relative z-20 bg-white border-4 border-black rounded-[40px] p-2 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] overflow-hidden w-full max-w-md"
            >
              <div className="bg-[#800000] aspect-[4/5] rounded-[32px] flex flex-col items-center justify-center p-8 text-center">
                <div className="w-24 h-24 bg-[#FFD700] border-4 border-black rounded-full mb-6 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                   <Heart className="w-12 h-12 text-black fill-black" />
                </div>
                <h3 className="text-white font-black text-3xl mb-4 leading-tight uppercase tracking-tighter">
                  Built with <br /> Passion for PUP
                </h3>
                <p className="text-white/80 font-bold">
                  Bridging the gap between physical distance and campus life through innovation.
                </p>
              </div>
            </motion.div>

            {/* Decorative Offset Card (Back) */}
            <div className="absolute top-10 left-10 w-full max-w-md aspect-[4/5] bg-[#FFD700] border-4 border-black rounded-[40px] z-10" />
            
            {/* Floating Badge */}
            <motion.div 
              animate={{ y: [0, -20, 0], rotate: [5, -5, 5] }}
              transition={{ repeat: Infinity, duration: 5 }}
              className="absolute -bottom-10 -right-4 z-30 bg-white border-4 border-black px-6 py-4 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            >
              <p className="font-black text-[#800000] text-xl italic">Since 2026</p>
            </motion.div>
          </div>

          {/* --- RIGHT: Content --- */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-[#800000] font-black uppercase tracking-widest text-sm italic mb-4 block">
                The Vision
              </span>
              <h2 className="text-5xl md:text-6xl font-black text-black leading-[0.9] mb-8 uppercase tracking-tighter">
                Redefining the <br />
                <span className="text-[#800000]">Campus Experience</span>
              </h2>
              
              <p className="text-xl text-black/70 font-bold mb-10 leading-relaxed">
                The PUP Lopez 3D Campus Tour is more than just a map. It’s an immersive 
                digital twin designed to help freshmen, visitors, and alumni explore our 
                historic campus from anywhere in the world. 
              </p>

              {/* Mini Stats/Values Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: Target, label: "Precision", text: "Accurate 1:1 modeling" },
                  { icon: Zap, label: "Fast", text: "Optimized WebGL performance" },
                  { icon: Users, label: "Interactive", text: "AI-powered NPC guides" }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 border-2 border-black/10 rounded-2xl hover:bg-white hover:border-black transition-all group">
                    <div className="p-3 bg-black text-white rounded-xl group-hover:bg-[#FFD700] group-hover:text-black transition-colors">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-black text-black uppercase text-sm tracking-tighter">{item.label}</p>
                      <p className="text-sm font-bold text-black/50">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom CTA */}
              <div className="mt-12 p-8 bg-black rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-6 shadow-[12px_12px_0px_0px_rgba(255,215,0,1)]">
                <p className="text-white font-bold text-lg">Want to know more about the tech?</p>
                <button className="bg-[#FFD700] border-2 border-black px-6 py-3 rounded-xl font-black uppercase text-sm hover:translate-y-[-2px] transition-transform">
                  Read Documentation
                </button>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}