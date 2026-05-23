import { motion } from "framer-motion";
import { inspiredValuesContent } from "./data/inspiredValuesContent";

export function InspiredValuesGrid() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {inspiredValuesContent.map((value, index) => (
          <motion.div
            key={`banner-${value.letter}-${index}`}
            initial={{ opacity: 0, y: 8, rotate: value.tilt }}
            whileInView={{ opacity: 1, y: 0, rotate: value.tilt }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.08, rotate: 0 }}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 border-black text-lg font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:h-12 sm:w-12 sm:rounded-2xl sm:border-4 sm:text-2xl ${value.boxClass} ${value.letterClass}`}
          >
            {value.letter}
          </motion.div>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-2xl border-2 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:block sm:rounded-3xl sm:border-4">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="border-b-4 border-black bg-[#800000] text-white">
              <th className="px-4 py-3 text-xs font-black uppercase tracking-wider sm:px-5 sm:py-4 sm:text-sm">
                Values
              </th>
              <th className="px-4 py-3 text-xs font-black uppercase tracking-wider sm:px-5 sm:py-4 sm:text-sm">
                Definition
              </th>
              <th className="px-4 py-3 text-xs font-black uppercase tracking-wider sm:px-5 sm:py-4 sm:text-sm">
                Behavioral Manifestation
              </th>
            </tr>
          </thead>
          <tbody>
            {inspiredValuesContent.map((value, index) => (
              <tr
                key={`row-${value.letter}-${index}`}
                className="border-b-2 border-black/10 align-top last:border-b-0 odd:bg-[#FFFDF5] even:bg-white"
              >
                <td className="px-4 py-4 sm:px-5 sm:py-5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-black text-lg font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${value.boxClass} ${value.letterClass}`}
                    >
                      {value.letter}
                    </div>
                    <p className="text-xs font-black uppercase leading-snug tracking-tight text-black sm:text-sm">
                      {value.label}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-4 text-xs font-bold leading-relaxed text-black/75 sm:px-5 sm:py-5 sm:text-sm">
                  {value.definition}
                </td>
                <td className="px-4 py-4 sm:px-5 sm:py-5">
                  <p className="mb-2 text-[10px] font-black uppercase tracking-wide text-[#800000] sm:text-xs">
                    We act in ways that:
                  </p>
                  <ul className="space-y-1.5">
                    {value.behaviors.map((behavior) => (
                      <li
                        key={behavior}
                        className="flex items-start gap-2 text-xs font-bold leading-relaxed text-black/70 sm:text-sm"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#800000]" />
                        <span>{behavior}</span>
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 sm:hidden">
        {inspiredValuesContent.map((value, index) => (
          <motion.article
            key={`card-${value.letter}-${index}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="overflow-hidden rounded-2xl border-2 border-black bg-[#FFFDF5] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
          >
            <div className="flex items-center gap-3 border-b-2 border-black bg-white px-4 py-3">
              <motion.div
                style={{ rotate: value.tilt }}
                className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${value.boxClass}`}
              >
                <span className={`text-2xl font-black ${value.letterClass}`}>
                  {value.letter}
                </span>
              </motion.div>
              <h4 className="text-sm font-black uppercase leading-snug tracking-tight text-black">
                {value.label}
              </h4>
            </div>

            <div className="space-y-4 px-4 py-4">
              <div>
                <p className="mb-1.5 text-[10px] font-black uppercase tracking-widest text-[#800000]">
                  Definition
                </p>
                <p className="text-xs font-bold leading-relaxed text-black/75">
                  {value.definition}
                </p>
              </div>

              <div>
                <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-[#800000]">
                  Behavioral Manifestation
                </p>
                <p className="mb-2 text-xs font-black text-black/80">
                  We act in ways that:
                </p>
                <ul className="space-y-2">
                  {value.behaviors.map((behavior) => (
                    <li
                      key={behavior}
                      className="flex items-start gap-2 text-xs font-bold leading-relaxed text-black/70"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#800000]" />
                      <span>{behavior}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
