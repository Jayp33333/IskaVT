import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BookOpen,
  GraduationCap,
  Search,
  X,
} from "lucide-react";
import { PageHeader, Section, GoldUnderline } from "../marketing";
import {
  undergraduateDegreeCourses,
  undergraduateDiplomaCourses,
  graduatePrograms,
  programCollegeNames,
  type ProgramCollege,
  type ProgramOffer,
} from "./data/pupLopezContent";

type CategoryId = "degree" | "diploma" | "graduate";

type ProgramCategory = {
  id: CategoryId;
  label: string;
  count: number;
  items: ProgramOffer[];
  icon: typeof GraduationCap;
  accent: string;
  accentSoft: string;
  tabActive: string;
};

type ProgramEntry = ProgramOffer & {
  category: CategoryId;
  categoryLabel: string;
};

const categories: ProgramCategory[] = [
  {
    id: "degree",
    label: "Degree",
    count: undergraduateDegreeCourses.length,
    items: undergraduateDegreeCourses,
    icon: GraduationCap,
    accent: "bg-maroon",
    accentSoft: "bg-maroon/10 text-maroon",
    tabActive: "bg-white text-ink shadow-sm ring-1 ring-ink/10",
  },
  {
    id: "diploma",
    label: "Diploma",
    count: undergraduateDiplomaCourses.length,
    items: undergraduateDiplomaCourses,
    icon: Award,
    accent: "bg-maroon",
    accentSoft: "bg-maroon/10 text-maroon",
    tabActive: "bg-white text-ink shadow-sm ring-1 ring-ink/10",
  },
  {
    id: "graduate",
    label: "Graduate",
    count: graduatePrograms.length,
    items: graduatePrograms,
    icon: BookOpen,
    accent: "bg-ink",
    accentSoft: "bg-ink/10 text-ink",
    tabActive: "bg-white text-ink shadow-sm ring-1 ring-ink/10",
  },
];

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

const programDirectory: ProgramEntry[] = categories.flatMap((category) =>
  category.items.map((program) => ({
    ...program,
    category: category.id,
    categoryLabel: category.label,
  })),
);

const categoryById = Object.fromEntries(
  categories.map((category) => [category.id, category]),
) as Record<CategoryId, ProgramCategory>;

function matchesQuery(program: ProgramOffer, query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return true;
  }

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
  category,
  badge,
  index = 0,
}: {
  program: ProgramOffer;
  category: ProgramCategory;
  badge?: string;
  index?: number;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index % 12) * 0.02 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white p-4 transition-all duration-300 hover:border-maroon/25 hover:shadow-lg hover:shadow-maroon/5 sm:rounded-3xl sm:p-5"
    >
      <div
        className={`absolute inset-y-0 left-0 w-1 ${category.accent} opacity-80 transition-all group-hover:w-1.5`}
      />

      <div className="flex flex-1 flex-col pl-2">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-lg px-2.5 py-1 font-mono text-[11px] font-black tracking-wide sm:text-xs ${category.accentSoft}`}
          >
            {program.code}
          </span>
          {badge && (
            <span className="rounded-full bg-cream px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-ink/50">
              {badge}
            </span>
          )}
        </div>

        <p className="flex-1 text-sm font-bold leading-relaxed text-ink sm:text-[15px]">
          {program.title}
        </p>

        {program.college && (
          <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-ink/45">
            {program.college} · {programCollegeNames[program.college]}
          </p>
        )}
      </div>
    </motion.li>
  );
}

function ProgramGrid({ children }: { children: React.ReactNode }) {
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      {children}
    </ul>
  );
}

function CollegeGroup({
  college,
  programs,
  category,
}: {
  college: ProgramCollege | "other";
  programs: ProgramOffer[];
  category: ProgramCategory;
}) {
  return (
    <section>
      {college !== "other" && (
        <div className="mb-4 flex items-center gap-3 sm:mb-5">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[10px] font-black text-white sm:h-10 sm:w-10 sm:text-xs ${category.accent}`}
          >
            {college}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-black uppercase tracking-tight text-ink sm:text-base">
              {programCollegeNames[college]}
            </h3>
          </div>
        </div>
      )}

      <ProgramGrid>
        {programs.map((program, index) => (
          <ProgramCard
            key={`${program.code}-${program.title}`}
            program={program}
            category={category}
            index={index}
          />
        ))}
      </ProgramGrid>
    </section>
  );
}

function CategoryPanel({
  category,
  query,
}: {
  category: ProgramCategory;
  query: string;
}) {
  const visibleItems = category.items.filter((program) =>
    matchesQuery(program, query),
  );
  const collegeGroups = groupProgramsByCollege(visibleItems);

  if (visibleItems.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-3xl border border-dashed border-ink/20 bg-white/60 px-6 py-14 text-center">
        <GraduationCap className="mb-3 h-9 w-9 text-ink/20" />
        <p className="text-sm font-black uppercase tracking-tight text-ink/60">
          No programs found
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      {collegeGroups.map((group, index) => (
        <div key={group.college}>
          {index > 0 && (
            <div className="mb-8 h-px bg-gradient-to-r from-transparent via-ink/10 to-transparent sm:mb-10" />
          )}
          <CollegeGroup
            college={group.college}
            programs={group.items}
            category={category}
          />
        </div>
      ))}
    </div>
  );
}

function SearchResults({ entries }: { entries: ProgramEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-3xl border border-dashed border-ink/20 bg-white/60 px-6 py-14 text-center">
        <Search className="mb-4 h-10 w-10 text-ink/20" />
        <p className="text-lg font-black uppercase tracking-tight text-ink/70">
          No programs found
        </p>
      </div>
    );
  }

  return (
    <ProgramGrid>
      {entries.map((entry, index) => {
        const category = categoryById[entry.category];
        const badge = entry.college
          ? `${entry.categoryLabel} · ${programCollegeNames[entry.college]}`
          : entry.categoryLabel;

        return (
          <ProgramCard
            key={`${entry.category}-${entry.code}-${entry.title}`}
            program={entry}
            category={category}
            badge={badge}
            index={index}
          />
        );
      })}
    </ProgramGrid>
  );
}

function ProgramsToolbar({
  query,
  onQueryChange,
  isSearching,
  activeCategory,
  onCategoryChange,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  isSearching: boolean;
  activeCategory: CategoryId;
  onCategoryChange: (category: CategoryId) => void;
}) {
  return (
    <div className="sticky top-[4.5rem] z-20 mb-8 sm:top-20 sm:mb-10">
      <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white/90 shadow-sm backdrop-blur-md sm:rounded-3xl">
        <div className="relative p-3 sm:p-4">
          <Search
            className="pointer-events-none absolute left-6 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35 sm:left-7"
            aria-hidden
          />
          <input
            type="text"
            role="searchbox"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search programs..."
            className="w-full rounded-2xl border border-ink/10 bg-cream/50 py-3 pl-10 pr-10 text-sm font-bold text-ink placeholder:text-ink/35 transition-colors focus:border-maroon/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-maroon/10 sm:py-3.5 sm:pl-11 sm:pr-11 sm:text-base"
            aria-label="Search programs"
          />
          {query && (
            <button
              type="button"
              onClick={() => onQueryChange("")}
              className="absolute right-5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-ink/5 text-ink/60 transition-colors hover:bg-ink/10 hover:text-ink sm:right-6"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div
          className={`border-t border-ink/8 p-2 sm:p-2.5 ${
            isSearching ? "pointer-events-none opacity-40" : ""
          }`}
          role="tablist"
          aria-label="Program categories"
          aria-hidden={isSearching}
        >
          <div className="grid grid-cols-3 gap-1.5 rounded-2xl bg-cream/60 p-1.5 sm:gap-2 sm:p-2">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onCategoryChange(category.id)}
                  className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2.5 transition-all sm:flex-row sm:justify-center sm:gap-2 sm:rounded-2xl sm:px-3 sm:py-3 ${
                    isActive
                      ? category.tabActive
                      : "text-ink/50 hover:bg-white/60 hover:text-ink"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="text-[10px] font-black uppercase tracking-wide sm:text-xs">
                    {category.label}
                  </span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[9px] font-black tabular-nums sm:text-[10px] ${
                      isActive ? "bg-maroon/10 text-maroon" : "bg-ink/5 text-ink/40"
                    }`}
                  >
                    {category.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Programs() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryId>("degree");

  const isSearching = query.trim().length > 0;

  const searchResults = useMemo(
    () => programDirectory.filter((entry) => matchesQuery(entry, query)),
    [query],
  );

  const activeCategoryData = categoryById[activeCategory];

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
        description=""
      />

      <ProgramsToolbar
        query={query}
        onQueryChange={setQuery}
        isSearching={isSearching}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <AnimatePresence mode="wait">
        {isSearching ? (
          <motion.div
            key="search-results"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <SearchResults entries={searchResults} />
          </motion.div>
        ) : (
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            role="tabpanel"
          >
            <CategoryPanel category={activeCategoryData} query={query} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 overflow-hidden rounded-3xl border border-ink/10 bg-gradient-to-br from-maroon via-maroon to-[#5c0000] text-white shadow-xl shadow-maroon/15 sm:mt-14"
      >
        <div className="flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <h2 className="text-lg font-black uppercase tracking-tight sm:text-xl">
            Questions about enrollment?
          </h2>
          <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row">
            <Link
              to="/resources/faq/puplq"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gold px-5 py-3 text-xs font-black uppercase tracking-wide text-ink transition-transform hover:scale-[1.02] sm:text-sm"
            >
              Enrollment FAQ
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-5 py-3 text-xs font-black uppercase tracking-wide text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:text-sm"
            >
              Contact campus
            </Link>
          </div>
        </div>
      </motion.aside>
    </Section>
  );
}
