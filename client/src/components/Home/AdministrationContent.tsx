import { useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  ClipboardList,
  GraduationCap,
  Search,
  Users,
  X,
} from "lucide-react";
import {
  accreditationAreas,
  accreditationTaskForceLeads,
  administrationDesignees,
  administrationOfficeSections,
  facultyRoster,
  type AdministrationMember,
} from "./data/administrationContent";
import { getAdministrationImagePath } from "./utils/administrationImages";

const STAFF_PLACEHOLDER_IMAGE = "/images/pup-logo.png";

type SectionId = "designees" | "offices" | "faculty" | "accreditation";

type StaffEntry = {
  name: string;
  role?: string;
  group?: string;
  section: SectionId;
  sectionLabel: string;
};

type AdminSection = {
  id: SectionId;
  label: string;
  count: number;
  icon: typeof Users;
};

const officeStaffCount = administrationOfficeSections.reduce(
  (sum, section) => sum + section.members.length,
  0,
);

const accreditationStaffCount =
  accreditationTaskForceLeads.length +
  accreditationAreas.reduce((sum, area) => sum + area.members.length, 0);

const adminSections: AdminSection[] = [
  {
    id: "designees",
    label: "Designees",
    count: administrationDesignees.length,
    icon: Users,
  },
  {
    id: "offices",
    label: "Offices",
    count: officeStaffCount,
    icon: Building2,
  },
  {
    id: "faculty",
    label: "Faculty",
    count: facultyRoster.length,
    icon: GraduationCap,
  },
  {
    id: "accreditation",
    label: "Accreditation",
    count: accreditationStaffCount,
    icon: ClipboardList,
  },
];

function buildStaffDirectory(): StaffEntry[] {
  const entries: StaffEntry[] = [];

  for (const member of administrationDesignees) {
    entries.push({
      name: member.name,
      role: member.role,
      section: "designees",
      sectionLabel: "Designees",
    });
  }

  for (const section of administrationOfficeSections) {
    for (const member of section.members) {
      entries.push({
        name: member.name,
        role: member.role,
        group: section.title,
        section: "offices",
        sectionLabel: "Offices",
      });
    }
  }

  for (const name of facultyRoster) {
    entries.push({
      name,
      section: "faculty",
      sectionLabel: "Faculty",
    });
  }

  for (const member of accreditationTaskForceLeads) {
    entries.push({
      name: member.name,
      role: member.role,
      group: "Task Force Leads",
      section: "accreditation",
      sectionLabel: "Accreditation",
    });
  }

  for (const area of accreditationAreas) {
    for (const name of area.members) {
      entries.push({
        name,
        group: area.area,
        section: "accreditation",
        sectionLabel: "Accreditation",
      });
    }
  }

  return entries;
}

const staffDirectory = buildStaffDirectory();

function matchesQuery(entry: StaffEntry, query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return true;
  }

  return (
    entry.name.toLowerCase().includes(normalized) ||
    entry.role?.toLowerCase().includes(normalized) ||
    entry.group?.toLowerCase().includes(normalized) ||
    entry.sectionLabel.toLowerCase().includes(normalized)
  );
}

function StaffPhoto({ name }: { name: string }) {
  const [imageFailed, setImageFailed] = useState(false);
  const photoSrc = getAdministrationImagePath(name);
  const showPhoto = photoSrc && !imageFailed;

  if (showPhoto) {
    return (
      <img
        src={photoSrc}
        alt={name}
        loading="lazy"
        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        onError={() => setImageFailed(true)}
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-maroon/5 via-cream to-gold/10">
      <img
        src={STAFF_PLACEHOLDER_IMAGE}
        alt={name}
        className="h-10 w-10 object-contain opacity-70 sm:h-12 sm:w-12"
      />
    </div>
  );
}

function StaffCard({
  name,
  role,
  badge,
  index = 0,
}: {
  name: string;
  role?: string;
  badge?: string;
  index?: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index % 12) * 0.02 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white p-3 transition-all duration-300 hover:border-maroon/20 hover:shadow-lg hover:shadow-maroon/5 sm:rounded-3xl sm:p-3.5"
    >
      <div className="relative mb-3 aspect-square overflow-hidden rounded-xl bg-cream sm:rounded-2xl">
        <StaffPhoto name={name} />
      </div>

      {badge && (
        <span className="mb-2 w-fit rounded-full bg-cream px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-ink/50">
          {badge}
        </span>
      )}

      <h3 className="text-[11px] font-black uppercase leading-snug tracking-tight text-ink sm:text-xs">
        {name}
      </h3>
      {role && (
        <p className="mt-1.5 text-[10px] font-bold leading-snug text-maroon/75 sm:text-[11px]">
          {role}
        </p>
      )}
    </motion.article>
  );
}

function StaffGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-3 min-[520px]:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
      {children}
    </div>
  );
}

function GroupHeader({ title }: { title: string }) {
  return (
    <h3 className="mb-4 truncate text-sm font-black uppercase tracking-tight text-ink sm:mb-5 sm:text-base">
      {title}
    </h3>
  );
}

function GroupSection({
  title,
  children,
  showDivider = false,
}: {
  title: string;
  children: ReactNode;
  showDivider?: boolean;
}) {
  return (
    <section>
      {showDivider && (
        <div className="mb-8 h-px bg-gradient-to-r from-transparent via-ink/10 to-transparent sm:mb-10" />
      )}
      <GroupHeader title={title} />
      {children}
    </section>
  );
}

function DesigneesPanel() {
  return (
    <StaffGrid>
      {administrationDesignees.map((member, index) => (
        <StaffCard
          key={`${member.name}-${member.role}`}
          name={member.name}
          role={member.role}
          index={index}
        />
      ))}
    </StaffGrid>
  );
}

function OfficesPanel() {
  return (
    <div className="space-y-8 sm:space-y-10">
      {administrationOfficeSections.map((section, index) => (
        <GroupSection
          key={section.id}
          title={section.title}
          showDivider={index > 0}
        >
          <StaffGrid>
            {section.members.map((member: AdministrationMember, memberIndex) => (
              <StaffCard
                key={`${member.name}-${member.role}`}
                name={member.name}
                role={member.role}
                index={memberIndex}
              />
            ))}
          </StaffGrid>
        </GroupSection>
      ))}
    </div>
  );
}

function FacultyPanel() {
  return (
    <StaffGrid>
      {facultyRoster.map((name, index) => (
        <StaffCard key={name} name={name} index={index} />
      ))}
    </StaffGrid>
  );
}

function AccreditationPanel() {
  return (
    <div className="space-y-8 sm:space-y-10">
      <GroupSection title="Task Force Leads">
        <StaffGrid>
          {accreditationTaskForceLeads.map((member, index) => (
            <StaffCard
              key={`${member.name}-${member.role}`}
              name={member.name}
              role={member.role}
              index={index}
            />
          ))}
        </StaffGrid>
      </GroupSection>

      {accreditationAreas.map((area) => (
        <GroupSection
          key={area.area}
          title={area.area}
          showDivider
        >
          <StaffGrid>
            {area.members.map((member, memberIndex) => (
              <StaffCard
                key={`${area.area}-${member}`}
                name={member}
                index={memberIndex}
              />
            ))}
          </StaffGrid>
        </GroupSection>
      ))}
    </div>
  );
}

function SearchResults({ entries }: { entries: StaffEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-3xl border border-dashed border-ink/20 bg-white/60 px-6 py-14 text-center">
        <Search className="mb-4 h-10 w-10 text-ink/20" />
        <p className="text-lg font-black uppercase tracking-tight text-ink/70">
          No staff found
        </p>
      </div>
    );
  }

  return (
    <StaffGrid>
      {entries.map((entry, index) => (
        <StaffCard
          key={`${entry.section}-${entry.group ?? ""}-${entry.name}-${entry.role ?? ""}`}
          name={entry.name}
          role={entry.role}
          badge={
            entry.group
              ? `${entry.sectionLabel} · ${entry.group}`
              : entry.sectionLabel
          }
          index={index}
        />
      ))}
    </StaffGrid>
  );
}

function AdministrationToolbar({
  query,
  onQueryChange,
  isSearching,
  activeSection,
  onSectionChange,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  isSearching: boolean;
  activeSection: SectionId;
  onSectionChange: (section: SectionId) => void;
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
            placeholder="Search staff..."
            className="w-full rounded-2xl border border-ink/10 bg-cream/50 py-3 pl-10 pr-10 text-sm font-bold text-ink placeholder:text-ink/35 transition-colors focus:border-maroon/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-maroon/10 sm:py-3.5 sm:pl-11 sm:pr-11 sm:text-base"
            aria-label="Search campus staff"
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
          aria-label="Administration sections"
          aria-hidden={isSearching}
        >
          <div className="grid grid-cols-2 gap-1.5 rounded-2xl bg-cream/60 p-1.5 min-[480px]:grid-cols-4 sm:gap-2 sm:p-2">
            {adminSections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;

              return (
                <button
                  key={section.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onSectionChange(section.id)}
                  className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2.5 transition-all sm:flex-row sm:justify-center sm:gap-2 sm:rounded-2xl sm:px-3 sm:py-3 ${
                    isActive
                      ? "bg-white text-ink shadow-sm ring-1 ring-ink/10"
                      : "text-ink/50 hover:bg-white/60 hover:text-ink"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="text-[10px] font-black uppercase tracking-wide sm:text-xs">
                    {section.label}
                  </span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[9px] font-black tabular-nums sm:text-[10px] ${
                      isActive ? "bg-maroon/10 text-maroon" : "bg-ink/5 text-ink/40"
                    }`}
                  >
                    {section.count}
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

export function AdministrationContent() {
  const [activeSection, setActiveSection] = useState<SectionId>("designees");
  const [query, setQuery] = useState("");

  const isSearching = query.trim().length > 0;

  const searchResults = useMemo(
    () => staffDirectory.filter((entry) => matchesQuery(entry, query)),
    [query],
  );

  return (
    <div>
      <AdministrationToolbar
        query={query}
        onQueryChange={setQuery}
        isSearching={isSearching}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
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
            key={activeSection}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            role="tabpanel"
          >
            {activeSection === "designees" && <DesigneesPanel />}
            {activeSection === "offices" && <OfficesPanel />}
            {activeSection === "faculty" && <FacultyPanel />}
            {activeSection === "accreditation" && <AccreditationPanel />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
