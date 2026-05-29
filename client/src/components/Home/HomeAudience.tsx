import { motion } from "framer-motion";
import { GraduationCap, Users, Heart, Building2 } from "lucide-react";
import { Section, SectionEyebrow } from "../marketing";
import { homeAudienceCards } from "./data/homeContent";

const audienceIcons = [GraduationCap, Users, Heart, Building2];

export function HomeAudience() {
  return (
    <Section id="audience">
      <div className="mb-10 flex flex-col items-center text-center sm:mb-12">
        <SectionEyebrow animated>Built For Everyone</SectionEyebrow>
        <h2 className="text-3xl font-black uppercase leading-tight tracking-tighter text-ink sm:text-4xl md:text-5xl">
          Who Is This <span className="text-maroon">For?</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        {homeAudienceCards.map((card, index) => {
          const Icon = audienceIcons[index];

          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="flex gap-4 rounded-2xl border-2 border-ink bg-white p-5 shadow-brutal-md sm:rounded-3xl sm:border-4 sm:p-6"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-ink bg-gold shadow-brutal-sm sm:h-14 sm:w-14 sm:rounded-2xl sm:border-4">
                <Icon className="h-6 w-6 text-ink sm:h-7 sm:w-7" />
              </div>
              <div>
                <h3 className="mb-2 text-lg font-black uppercase tracking-tighter text-maroon sm:text-xl">
                  {card.title}
                </h3>
                <p className="text-sm font-bold leading-relaxed text-ink/70 sm:text-base">
                  {card.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
