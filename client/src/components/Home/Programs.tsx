import { motion } from "framer-motion";
import { PageHeader, Section } from "../marketing";
import {
  undergraduateDegreeCourses,
  undergraduateDiplomaCourses,
  graduatePrograms,
  type ProgramOffer,
} from "./data/pupLopezContent";

type ProgramCategory = {
  id: string;
  title: string;
  tagline: string;
  items: ProgramOffer[];
  asideClass: string;
  bodyClass: string;
  tileClass: string;
};

const categories: ProgramCategory[] = [
  {
    id: "degree",
    title: "Degree Programs",
    tagline: "Undergraduate bachelor's tracks",
    items: undergraduateDegreeCourses,
    asideClass: "bg-gold text-ink",
    bodyClass: "bg-cream",
    tileClass: "border-ink bg-surface hover:border-maroon",
  },
  {
    id: "diploma",
    title: "Diploma Programs",
    tagline: "Technology & office management",
    items: undergraduateDiplomaCourses,
    asideClass: "bg-maroon text-white",
    bodyClass: "bg-surface",
    tileClass: "border-ink bg-cream hover:border-maroon",
  },
  {
    id: "graduate",
    title: "Graduate Programs",
    tagline: "PUP Open University offerings",
    items: graduatePrograms,
    asideClass: "bg-dark-panel text-gold",
    bodyClass: "bg-muted",
    tileClass: "border-ink bg-surface hover:border-gold",
  },
];

function ProgramTile({
  program,
  index,
  tileClass,
}: {
  program: ProgramOffer;
  index: number;
  tileClass: string;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.03 }}
      className={`rounded-xl border-2 p-3 transition-colors sm:rounded-2xl sm:border-[3px] sm:p-4 ${tileClass}`}
    >
      <p className="font-mono text-[10px] font-black uppercase text-maroon sm:text-xs">
        {program.code}
      </p>
      <p className="mt-1.5 text-xs font-bold leading-snug text-ink/85 sm:text-sm">
        {program.title}
      </p>
    </motion.li>
  );
}

function CategoryBlock({ category }: { category: ProgramCategory }) {
  const aside = (
    <aside
      className={`flex flex-col justify-between border-b-2 border-ink p-5 sm:p-6 lg:border-b-0 lg:border-r-2 lg:p-8 ${category.asideClass}`}
    >
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.22em] opacity-75 sm:text-xs">
          {category.tagline}
        </p>
        <h3 className="mt-2 text-xl font-black uppercase tracking-tighter sm:text-2xl lg:text-3xl">
          {category.title}
        </h3>
      </div>
      <p className="mt-6 text-sm font-black tabular-nums sm:text-base">
        {category.items.length} programs
      </p>
    </aside>
  );

  const body = (
    <ul
      className={`grid grid-cols-1 gap-2.5 p-4 sm:grid-cols-2 sm:gap-3 sm:p-5 lg:grid-cols-2 lg:gap-4 lg:p-6 xl:grid-cols-3 ${category.bodyClass}`}
    >
      {category.items.map((program, index) => (
        <ProgramTile
          key={`${program.code}-${program.title}`}
          program={program}
          index={index}
          tileClass={category.tileClass}
        />
      ))}
    </ul>
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      className="overflow-hidden rounded-2xl border-2 border-ink shadow-brutal-md sm:rounded-3xl sm:border-4"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,13rem)_1fr] xl:grid-cols-[minmax(0,15rem)_1fr]">
        {aside}
        {body}
      </div>
    </motion.article>
  );
}

export function Programs() {
  const degreeCount = undergraduateDegreeCourses.length;
  const diplomaCount = undergraduateDiplomaCourses.length;
  const graduateCount = graduatePrograms.length;
  const totalPrograms = degreeCount + diplomaCount + graduateCount;

  return (
    <Section id="programs" dotGrid>
      <PageHeader
        title={
          <>
            Academic <span className="text-maroon">Programs</span>
          </>
        }
        description="Explore undergraduate and graduate offerings designed to meet local and international standards of quality and excellence."
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-8 grid grid-cols-2 gap-3 sm:mb-10 sm:gap-4 lg:grid-cols-4 lg:grid-rows-2"
      >
        <div className="col-span-2 row-span-2 flex flex-col justify-between rounded-2xl border-2 border-ink bg-ink p-5 text-gold shadow-brutal-lg sm:rounded-3xl sm:border-4 sm:p-6 lg:col-span-1">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gold/70 sm:text-xs">
            All programs
          </p>
          <p className="mt-2 font-black tabular-nums leading-none text-6xl sm:text-7xl lg:text-8xl">
            {totalPrograms}
          </p>
          <p className="mt-3 text-xs font-bold text-gold/80 sm:text-sm">
            Degree, diploma &amp; graduate combined
          </p>
        </div>

        {[
          { label: "Degree", value: degreeCount, className: "bg-gold text-ink" },
          { label: "Diploma", value: diplomaCount, className: "bg-maroon text-white" },
          { label: "Graduate", value: graduateCount, className: "bg-surface text-ink" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.06 }}
            className={`flex items-center justify-between rounded-2xl border-2 border-ink px-4 py-4 shadow-brutal-sm sm:rounded-3xl sm:border-4 sm:px-5 sm:py-5 lg:col-span-1 ${stat.className} ${
              index === 2 ? "col-span-2 lg:col-span-1" : ""
            }`}
          >
            <span className="text-xs font-black uppercase tracking-widest opacity-80 sm:text-sm">
              {stat.label}
            </span>
            <span className="text-3xl font-black tabular-nums sm:text-4xl">
              {stat.value}
            </span>
          </motion.div>
        ))}
      </motion.div>

      <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10">
        {categories.map((category) => (
          <CategoryBlock key={category.id} category={category} />
        ))}
      </div>
    </Section>
  );
}
