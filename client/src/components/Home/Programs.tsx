import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BookOpen,
  GraduationCap,
  Search,
  X,
} from "lucide-react";
import {
  PageHeader,
  Section,
  SectionEyebrow,
  GoldUnderline,
} from "../marketing";
import {
  undergraduateDegreeCourses,
  undergraduateDiplomaCourses,
  graduatePrograms,
  programCollegeNames,
  programsPageIntro,
  type ProgramCollege,
  type ProgramOffer,
} from "./data/pupLopezContent";

type CategoryId = "degree" | "diploma" | "graduate";
type FilterId = "all" | CategoryId;

type ProgramCategory = {
  id: CategoryId;
  title: string;
  tagline: string;
  items: ProgramOffer[];
  headerClass: string;
  iconClass: string;
  accentClass: string;
  badgeClass: string;
};

const categories: ProgramCategory[] = [
  {
    id: "degree",
    title: "Degree Programs",
    tagline: "Undergraduate",
    items: undergraduateDegreeCourses,
    headerClass: "bg-gold text-ink",
    iconClass: "bg-ink text-gold",
    accentClass: "border-maroon",
    badgeClass: "bg-maroon/10 text-maroon",
  },
  {
    id: "diploma",
    title: "Diploma Programs",
    tagline: "Undergraduate",
    items: undergraduateDiplomaCourses,
    headerClass: "bg-maroon text-white",
    iconClass: "bg-gold text-ink",
    accentClass: "border-maroon",
    badgeClass: "bg-maroon/10 text-maroon",
  },
  {
    id: "graduate",
    title: "Graduate Programs",
    tagline: "PUP Open University",
    items: graduatePrograms,
    headerClass: "bg-ink text-gold",
    iconClass: "bg-gold text-ink",
    accentClass: "border-gold",
    badgeClass: "bg-gold/20 text-ink",
  },
];

const categoryIcons: Record<CategoryId, typeof GraduationCap> = {
  degree: GraduationCap,
  diploma: Award,
  graduate: BookOpen,
};

const filterOptions: { id: FilterId; label: string }[] = [
  { id: "all", label: "All Programs" },
  { id: "degree", label: "Degree" },
  { id: "diploma", label: "Diploma" },
  { id: "graduate", label: "Graduate" },
];

const degreeCount = undergraduateDegreeCourses.length;
const diplomaCount = undergraduateDiplomaCourses.length;
const graduateCount = graduatePrograms.length;
const totalPrograms = degreeCount + diplomaCount + graduateCount;

const collegeOrder: ProgramCollege[] = [
  "COA",
  "CB",
  "COED",
  "CEA",
  "CTHRM",
  "COPA",
  "CT",
  "CAS",
];

function matchesQuery(program: ProgramOffer, query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  const collegeName = program.college
    ? programCollegeNames[program.college].toLowerCase()
    : "";
  return (
    program.code.toLowerCase().includes(normalized) ||
    program.title.toLowerCase().includes(normalized) ||
    collegeName.includes(normalized) ||
    (program.college?.toLowerCase().includes(normalized) ?? false)
  );
}

function groupProgramsByCollege(programs: ProgramOffer[]) {
  const grouped = new Map<ProgramCollege | "other", ProgramOffer[]>();

  for (const program of programs) {
    const key = program.college ?? "other";
    const items = grouped.get(key) ?? [];
    items.push(program);
    grouped.set(key, items);
  }

  const ordered: { college: ProgramCollege | "other"; items: ProgramOffer[] }[] =
    [];

  for (const college of collegeOrder) {
    const items = grouped.get(college);
    if (items?.length) {
      ordered.push({ college, items });
      grouped.delete(college);
    }
  }

  const other = grouped.get("other");
  if (other?.length) {
    ordered.push({ college: "other", items: other });
  }

  return ordered;
}

function ProgramCard({
  program,
  accentClass,
  badgeClass,
}: {
  program: ProgramOffer;
  accentClass: string;
  badgeClass: string;
}) {
  return (
    <li
      className={`group flex flex-col rounded-xl border border-ink/15 bg-white p-4 transition-colors hover:border-ink hover:bg-cream sm:rounded-2xl sm:p-5 ${accentClass} border-l`}
    >
      <span
        className={`inline-flex w-fit rounded-md px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-wide sm:text-xs ${badgeClass}`}
      >
        {program.code}
      </span>
      <p className="mt-3 text-sm font-bold leading-snug text-ink sm:text-base">
        {program.title}
      </p>
    </li>
  );
}

function CategorySection({
  category,
  query,
}: {
  category: ProgramCategory;
  query: string;
}) {
  const Icon = categoryIcons[category.id];
  const visibleItems = category.items.filter((program) =>
    matchesQuery(program, query),
  );
  const collegeGroups = groupProgramsByCollege(visibleItems);

  if (visibleItems.length === 0) return null;

  return (
    <motion.section
      id={`programs-${category.id}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      className="scroll-mt-28 overflow-hidden rounded-2xl border border-ink bg-white sm:rounded-3xl"
    >
      <div
        className={`flex items-start gap-4 border-b border-ink p-5 sm:items-center sm:p-6 lg:p-8 ${category.headerClass}`}
      >
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-ink sm:h-14 sm:w-14 sm:rounded-2xl ${category.iconClass}`}
        >
          <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] opacity-75 sm:text-xs">
            {category.tagline}
          </p>
          <h2 className="mt-1 text-xl font-black uppercase tracking-tighter sm:text-2xl lg:text-3xl">
            {category.title}
          </h2>
        </div>
      </div>

      <div className="flex flex-col gap-6 bg-cream/50 p-4 sm:gap-8 sm:p-6">
        {collegeGroups.map((group) => (
          <div key={group.college}>
            {group.college !== "other" ? (
              <h3 className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-maroon sm:mb-4 sm:text-sm">
                {programCollegeNames[group.college]}
              </h3>
            ) : null}
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {group.items.map((program) => (
                <ProgramCard
                  key={`${program.code}-${program.title}`}
                  program={program}
                  accentClass={category.accentClass}
                  badgeClass={category.badgeClass}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

export function Programs() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");

  const filteredCategories = useMemo(() => {
    return categories
      .filter(
        (category) => activeFilter === "all" || category.id === activeFilter,
      )
      .map((category) => ({
        ...category,
        visibleCount: category.items.filter((program) =>
          matchesQuery(program, query),
        ).length,
      }))
      .filter((category) => category.visibleCount > 0);
  }, [query, activeFilter]);

  const visibleProgramCount = filteredCategories.reduce(
    (sum, category) => sum + category.visibleCount,
    0,
  );

  const handleFilterChange = (filter: FilterId) => {
    setActiveFilter(filter);
    if (filter !== "all") {
      requestAnimationFrame(() => {
        document
          .getElementById(`programs-${filter}`)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };

  return (
    <Section id="programs" dotGrid>
      <PageHeader
        title={
          <>
            Academic{" "}
            <span className="relative text-maroon">
              Programs
              <GoldUnderline />
            </span>
          </>
        }
        description={programsPageIntro}
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto mb-6 grid max-w-2xl grid-cols-2 gap-2 sm:mb-8 sm:max-w-3xl sm:grid-cols-4 sm:gap-3"
      >
        <div className="col-span-2 flex items-center justify-between gap-3 rounded-xl border border-ink bg-ink px-4 py-3 text-gold sm:col-span-1 sm:flex-col sm:items-start sm:gap-1 sm:px-3 sm:py-3">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gold/70">
            Total
          </p>
          <p className="font-black tabular-nums leading-none text-2xl sm:text-3xl">
            {totalPrograms}
          </p>
          <p className="hidden text-[10px] font-bold text-gold/70 sm:block">
            All tracks
          </p>
        </div>

        {[
          {
            label: "Degree",
            value: degreeCount,
            className: "bg-gold text-ink",
          },
          {
            label: "Diploma",
            value: diplomaCount,
            className: "bg-maroon text-white",
          },
          {
            label: "Graduate",
            value: graduateCount,
            className: "bg-white text-ink",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.06 }}
            className={`flex items-center justify-between gap-2 rounded-xl border border-ink px-3 py-3 sm:flex-col sm:items-start sm:gap-1 ${stat.className}`}
          >
            <span className="text-[10px] font-black uppercase tracking-widest opacity-75">
              {stat.label}
            </span>
            <span className="text-xl font-black tabular-nums sm:text-2xl">
              {stat.value}
            </span>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-8 rounded-2xl border border-ink bg-white p-4 sm:mb-10 sm:rounded-3xl sm:p-6"
      >
        <SectionEyebrow className="text-left not-italic tracking-[0.2em]">
          Find a Program
        </SectionEyebrow>

        <div className="relative">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40 sm:h-5 sm:w-5"
            aria-hidden
          />
          <input
            type="text"
            role="searchbox"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by program name or code (e.g. BSIT, Accountancy)…"
            className="w-full rounded-xl border border-ink bg-cream py-3 pl-11 pr-11 text-sm font-bold text-ink shadow-none placeholder:text-ink/40 focus:border-maroon focus:outline-none focus:ring-0 sm:rounded-2xl sm:py-3.5 sm:pl-12 sm:text-base"
            aria-label="Search programs"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg border border-ink bg-white text-ink transition-colors hover:bg-cream"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div
          className="mt-4 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Filter programs by category"
        >
          {filterOptions.map((option) => {
            const isActive = activeFilter === option.id;
            return (
              <button
                key={option.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleFilterChange(option.id)}
                className={`rounded-full border border-ink px-4 py-2 text-xs font-black uppercase tracking-wide transition-colors sm:text-sm ${
                  isActive
                    ? "bg-maroon text-white"
                    : "bg-cream text-ink hover:bg-gold/30"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {(query || activeFilter !== "all") && (
          <p className="mt-4 text-xs font-bold text-ink/60 sm:text-sm">
            Showing{" "}
            <span className="font-black text-maroon">{visibleProgramCount}</span>{" "}
            {visibleProgramCount === 1 ? "program" : "programs"}
            {query ? (
              <>
                {" "}
                matching &ldquo;<span className="text-ink">{query}</span>&rdquo;
              </>
            ) : null}
          </p>
        )}
      </motion.div>

      {filteredCategories.length > 0 ? (
        <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10">
          {filteredCategories.map((category) => (
            <CategorySection
              key={category.id}
              category={category}
              query={query}
            />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl border border-dashed border-ink/30 bg-white px-6 py-12 text-center sm:rounded-3xl sm:py-16"
        >
          <p className="text-lg font-black uppercase tracking-tighter text-ink sm:text-xl">
            No programs found
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm font-bold text-ink/60 sm:text-base">
            Try a different search term or clear your filters to browse all
            offerings.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setActiveFilter("all");
            }}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-ink bg-gold px-5 py-2.5 text-xs font-black uppercase tracking-wide text-ink transition-colors hover:bg-gold/80 sm:text-sm"
          >
            Reset filters
          </button>
        </motion.div>
      )}

      <motion.aside
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-10 overflow-hidden rounded-2xl border border-ink bg-maroon text-white sm:mt-12 sm:rounded-3xl"
      >
        <div className="flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="max-w-xl">
            <SectionEyebrow className="text-gold not-italic">
              Ready to enroll?
            </SectionEyebrow>
            <h2 className="text-xl font-black uppercase tracking-tighter sm:text-2xl">
              Questions about admission or enrollment?
            </h2>
            <p className="mt-2 text-sm font-bold leading-relaxed text-white/80 sm:text-base">
              Visit our FAQ for step-by-step enrollment guides, or reach out to
              the campus for personalized assistance.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              to="/resources/faq/puplq"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-ink bg-gold px-5 py-3 text-xs font-black uppercase tracking-wide text-ink transition-colors hover:bg-gold/90 sm:text-sm"
            >
              View enrollment FAQ
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white bg-transparent px-5 py-3 text-xs font-black uppercase tracking-wide text-white transition-colors hover:bg-white/10 sm:text-sm"
            >
              Contact campus
            </Link>
          </div>
        </div>
      </motion.aside>
    </Section>
  );
}
