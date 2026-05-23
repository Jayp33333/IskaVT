import { motion } from "framer-motion";
import { MessageCircle, Sparkles } from "lucide-react";
import { CONTACT_INFO_ITEMS } from "../constants";

export function ContactInfoPanel() {
  return (
    <div className="flex w-full flex-col justify-between lg:w-2/5 xl:w-1/3">
      <div>
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mb-3 block text-xs font-black uppercase tracking-widest text-[#800000] italic sm:mb-4 sm:text-sm"
        >
          Get in Touch
        </motion.span>
        <h2 className="mb-4 text-3xl font-black uppercase leading-[0.95] tracking-tighter text-black sm:mb-5 sm:text-4xl md:text-5xl">
          READY TO <br />
          <span className="text-[#800000]">TALK?</span>
        </h2>
        <p className="mb-6 max-w-md text-sm font-bold leading-relaxed text-black/70 sm:mb-8 sm:text-base">
          Have questions about the 3D campus or found a bug? Send us a message and our team will
          get back to you faster than a teleport icon!
        </p>

        <div className="space-y-3 sm:space-y-4">
          {CONTACT_INFO_ITEMS.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-xl border-2 border-black bg-white p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:gap-4 sm:rounded-2xl sm:border-4 sm:p-4"
            >
              <div className="rounded-lg border-2 border-black bg-[#FFD700] p-1.5 sm:p-2">
                <item.icon className="h-4 w-4 text-black sm:h-5 sm:w-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase leading-none opacity-50">
                  {item.label}
                </p>
                <p className="text-xs font-black sm:text-sm">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="relative mt-8 rounded-2xl border-2 border-black bg-[#800000] p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] sm:mt-10 sm:rounded-[28px] sm:border-4 sm:p-5"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-white sm:h-11 sm:w-11">
            <Sparkles className="h-5 w-5 text-[#FFD700] sm:h-6 sm:w-6" />
          </div>
          <p className="text-sm font-black italic text-white sm:text-base">
            &quot;I&apos;m usually online 24/7!&quot;
          </p>
        </div>
        <div className="absolute -top-2.5 -left-2.5 sm:-top-3 sm:-left-3">
          <MessageCircle className="h-6 w-6 fill-[#FFD700] stroke-black stroke-[2px] text-[#FFD700] sm:h-7 sm:w-7" />
        </div>
      </motion.div>
    </div>
  );
}
