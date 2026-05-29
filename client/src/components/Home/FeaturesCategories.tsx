import { motion } from "framer-motion";
import { featureCategories } from "./data/featuresContent";

export function FeaturesCategories() {
  return (
    <section className="mt-12 sm:mt-16">
      <div className="mb-6 text-center sm:mb-8">
        <h2 className="text-2xl font-black uppercase tracking-tighter text-black sm:text-3xl">
          Feature <span className="text-[#800000]">Categories</span>
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm font-bold text-black/60 sm:text-base">
          Capabilities grouped by how they help you explore and learn about campus.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
        {featureCategories.map((category, index) => (
          <motion.article
            key={category.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.06 }}
            className="rounded-2xl border-2 border-black bg-[#FFFDF5] p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] sm:rounded-3xl sm:border-4 sm:p-6"
          >
            <h3 className="mb-2 text-lg font-black uppercase tracking-tighter text-[#800000] sm:text-xl">
              {category.title}
            </h3>
            <p className="mb-4 text-sm font-bold leading-relaxed text-black/70 sm:text-base">
              {category.summary}
            </p>
            <ul className="space-y-2">
              {category.items.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-xs font-black uppercase tracking-tight text-black sm:text-sm"
                >
                  <span className="h-2 w-2 shrink-0 rounded-full bg-[#FFD700] ring-2 ring-black" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
