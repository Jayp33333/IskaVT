import { motion } from "framer-motion";
import { strategicGoalsContent } from "./data/strategicGoalsContent";

export function StrategicGoalsGrid() {
  return (
    <div className="space-y-5 sm:space-y-6">
      {strategicGoalsContent.map((pillar, pillarIndex) => (
        <motion.article
          key={pillar.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: pillarIndex * 0.08 }}
          className="overflow-hidden rounded-2xl border-2 border-black bg-[#FFFDF5] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:rounded-3xl sm:border-4"
        >
          <div
            className={`flex items-center gap-3 border-b-2 border-black px-4 py-3 sm:gap-4 sm:border-b-4 sm:px-5 sm:py-4 ${pillar.accentClass}`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-white text-sm font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:h-11 sm:w-11 sm:rounded-2xl sm:border-4 sm:text-base">
              {pillar.number}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-70 sm:text-xs">
                Pillar {pillar.number}
              </p>
              <h4
                className={`text-sm font-black uppercase leading-snug tracking-tight sm:text-base md:text-lg ${pillar.headerClass}`}
              >
                {pillar.title}
              </h4>
            </div>
          </div>

          <ul className="divide-y-2 divide-black/10">
            {pillar.goals.map((goal, goalIndex) => (
              <motion.li
                key={goal.id}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: pillarIndex * 0.08 + goalIndex * 0.04 }}
                className="flex items-start gap-3 px-4 py-3 sm:gap-4 sm:px-5 sm:py-4"
              >
                <span className="mt-0.5 shrink-0 rounded-lg border-2 border-black bg-[#800000] px-2 py-1 text-[10px] font-black uppercase text-white sm:text-xs">
                  {goal.id}
                </span>
                <p className="text-xs font-bold leading-relaxed text-black/80 sm:text-sm md:text-base">
                  {goal.title}
                </p>
              </motion.li>
            ))}
          </ul>
        </motion.article>
      ))}
    </div>
  );
}
