import { motion } from "framer-motion";
import { GraduationCap, Award } from "lucide-react";
import { PageHeader, Section } from "../marketing";
import {
  undergraduateDegreeCourses,
  undergraduateDiplomaCourses,
  graduatePrograms,
  type ProgramOffer,
} from "./data/pupLopezContent";

type ProgramCardProps = {
  program: ProgramOffer;
  index: number;
  accent: "gold" | "maroon" | "cream";
};

const accentStyles = {
  gold: {
    badge: "bg-[#FFD700] text-black",
    card: "bg-[#FFFDF5] hover:shadow-[8px_8px_0px_0px_rgba(255,215,0,1)]",
  },
  maroon: {
    badge: "bg-[#800000] text-white",
    card: "bg-white hover:shadow-[8px_8px_0px_0px_rgba(128,0,0,1)]",
  },
  cream: {
    badge: "bg-white text-[#800000]",
    card: "bg-[#FFFDF5] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
  },
};

function ProgramCard({ program, index, accent }: ProgramCardProps) {
  const styles = accentStyles[accent];
  const tilt = index % 2 === 0 ? -1.5 : 1.5;

  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04 }}
      whileHover={{ y: -4, x: -2 }}
      style={{ rotate: tilt }}
      className={`list-none rounded-2xl border-2 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow sm:rounded-3xl sm:border-4 sm:p-4 ${styles.card}`}
    >
      <div className="mb-2">
        <span
          className={`inline-block rounded-lg border-2 border-black px-2 py-0.5 text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:text-xs ${styles.badge}`}
        >
          {program.code}
        </span>
      </div>
      <p className="text-xs font-bold leading-snug text-black/80 sm:text-sm">
        {program.title}
      </p>
    </motion.li>
  );
}

type ProgramSectionProps = {
  title: string;
  items: ProgramOffer[];
  accent: "gold" | "maroon" | "cream";
  delay?: number;
};

function ProgramSection({
  title,
  items,
  accent,
  delay = 0,
}: ProgramSectionProps) {
  const titleColor =
    accent === "gold"
      ? "text-[#FFD700] drop-shadow-[1px_1px_0_rgba(0,0,0,1)]"
      : accent === "maroon"
        ? "text-[#800000]"
        : "text-black";

  const dashColor = accent === "gold" ? "bg-[#FFD700]" : "bg-[#800000]";

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="overflow-hidden rounded-2xl sm:rounded-[2rem]"
    >
      <div className="flex items-center gap-3 px-4 py-4 sm:gap-4 sm:px-6 sm:py-5">
        <span
          aria-hidden
          className={`h-8 w-1.5 shrink-0 rounded-full sm:h-10 sm:w-2 ${dashColor}`}
        />
        <h3
          className={`text-xl font-black uppercase tracking-tighter sm:text-2xl md:text-3xl ${titleColor}`}
        >
          {title}
        </h3>
      </div>

      <ul className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:gap-4 sm:p-6 lg:grid-cols-3">
        {items.map((program, index) => (
          <ProgramCard
            key={`${program.code}-${program.title}`}
            program={program}
            index={index}
            accent={accent}
          />
        ))}
      </ul>
    </motion.section>
  );
}

export function Programs() {
  const totalPrograms =
    undergraduateDegreeCourses.length +
    undergraduateDiplomaCourses.length +
    graduatePrograms.length;

  return (
    <Section id="programs">
      <div className="pointer-events-none absolute -left-16 top-20 h-56 w-56 rounded-full bg-gold/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 bottom-10 h-64 w-64 rounded-full bg-maroon/10 blur-3xl" />

      <PageHeader
        title={
          <>
            Academic <span className="text-maroon">Programs</span>
          </>
        }
        description="Explore undergraduate and graduate offerings designed to meet local and international standards of quality and excellence."
      />

      <div className="mt-6 flex flex-wrap justify-center gap-3 sm:mt-0 sm:gap-4">
            {[
              {
                label: "Degree",
                count: undergraduateDegreeCourses.length,
                color: "bg-[#FFD700]",
              },
              {
                label: "Diploma",
                count: undergraduateDiplomaCourses.length,
                color: "bg-white",
              },
              {
                label: "Graduate",
                count: graduatePrograms.length,
                color: "bg-[#800000] text-white",
              },
              {
                label: "Total",
                count: totalPrograms,
                color: "bg-black text-[#FFD700]",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`rounded-xl border-2 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:rounded-2xl sm:border-4 sm:px-5 sm:py-3 ${stat.color}`}
              >
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80 sm:text-xs">
                  {stat.label}
                </p>
                <p className="text-xl font-black sm:text-2xl">{stat.count}</p>
              </div>
            ))}
      </div>

      <div className="space-y-6 sm:space-y-8">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-2xl border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:rounded-[2rem] sm:border-4"
          >
            <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:gap-5 sm:px-6 sm:py-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-black bg-[#FFD700] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:h-14 sm:w-14 sm:rounded-2xl sm:border-4">
                <GraduationCap className="h-6 w-6 text-black sm:h-7 sm:w-7" />
              </div>
              <div className="text-black">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/60 sm:text-xs">
                  PUP Lopez Campus
                </p>
                <h3 className="text-xl font-black uppercase tracking-tighter text-[#800000] sm:text-2xl md:text-3xl">
                  Undergraduate Programs
                </h3>
              </div>
            </div>

            <div className="space-y-6 p-4 sm:space-y-8 sm:p-6">
              <ProgramSection
                title="Degree Programs"
                items={undergraduateDegreeCourses}
                accent="gold"
              />
              <ProgramSection
                title="Diploma Programs"
                items={undergraduateDiplomaCourses}
                accent="maroon"
                delay={0.05}
              />
            </div>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="overflow-hidden rounded-2xl border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:rounded-[2rem] sm:border-4"
          >
            <div className="flex flex-col gap-4 border-b-2 border-black bg-[#FFD700] px-4 py-4 sm:flex-row sm:items-center sm:gap-5 sm:border-b-4 sm:px-6 sm:py-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:h-14 sm:w-14 sm:rounded-2xl sm:border-4">
                <Award className="h-6 w-6 text-[#800000] sm:h-7 sm:w-7" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/60 sm:text-xs">
                  PUP Open University
                </p>
                <h3 className="text-xl font-black uppercase tracking-tighter text-black sm:text-2xl md:text-3xl">
                  Graduate Programs
                </h3>
              </div>
            </div>

            <ul className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:gap-4 sm:p-6">
              {graduatePrograms.map((program, index) => (
                <ProgramCard
                  key={`${program.code}-${program.title}`}
                  program={program}
                  index={index}
                  accent="gold"
                />
              ))}
            </ul>
          </motion.article>
        </div>
    </Section>
  );
}
