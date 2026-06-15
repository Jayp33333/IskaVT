import { useMemo, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
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

const SECTION_NAV = [
  { id: "designees", label: "Designees" },
  { id: "offices", label: "Offices" },
  { id: "faculty", label: "Faculty" },
  { id: "accreditation", label: "Accreditation" },
] as const;

function StaffPhoto({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const photoSrc = getAdministrationImagePath(name);
  const showPhoto = photoSrc && !imageFailed;

  if (showPhoto) {
    return (
      <img
        src={photoSrc}
        alt={name}
        className={`h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105 ${className}`}
        onError={() => setImageFailed(true)}
      />
    );
  }

  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-maroon/10 via-cream to-gold/20 ${className}`}
    >
      <img
        src={STAFF_PLACEHOLDER_IMAGE}
        alt={name}
        className="h-12 w-12 object-contain opacity-80 sm:h-14 sm:w-14"
      />
    </div>
  );
}

function StaffCard({
  name,
  role,
  index = 0,
}: {
  name: string;
  role?: string;
  index?: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 10) * 0.03 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink/15 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-maroon/25 hover:shadow-brutal-sm sm:rounded-3xl"
    >
      <div className="relative aspect-square overflow-hidden bg-maroon/5">
        <StaffPhoto name={name} />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-3.5">
        <h3 className="text-[11px] font-black uppercase leading-snug tracking-tight text-ink sm:text-xs">
          {name}
        </h3>
        {role && (
          <span className="mt-auto inline-flex w-fit rounded-full bg-maroon/10 px-2 py-0.5 text-[9px] font-bold uppercase leading-snug tracking-wide text-maroon sm:text-[10px]">
            {role}
          </span>
        )}
      </div>
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

function SectionBlock({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="mb-5 text-xl font-black uppercase tracking-tighter text-ink sm:mb-6 sm:text-2xl">
        {title}
      </h2>
      {children}
    </section>
  );
}

function SectionNav() {
  return (
    <nav
      aria-label="Administration sections"
      className="sticky top-[4.5rem] z-20 -mx-1 mb-8 overflow-x-auto pb-1 sm:top-20 sm:mb-10"
    >
      <div className="flex w-max min-w-full gap-2 rounded-2xl border border-ink/10 bg-white/90 p-2 shadow-sm backdrop-blur-md sm:rounded-full sm:px-3">
        {SECTION_NAV.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="shrink-0 rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-wide text-ink/70 transition-colors hover:bg-maroon hover:text-white sm:text-xs"
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

export function AdministrationContent() {
  const [facultyQuery, setFacultyQuery] = useState("");

  const filteredFaculty = useMemo(() => {
    const query = facultyQuery.trim().toLowerCase();
    if (!query) {
      return facultyRoster;
    }

    return facultyRoster.filter((name) => name.toLowerCase().includes(query));
  }, [facultyQuery]);

  return (
    <div className="space-y-12 sm:space-y-14">
      <SectionNav />

      <SectionBlock id="designees" title="Designees">
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
      </SectionBlock>

      <SectionBlock id="offices" title="Offices">
        <div className="space-y-8 sm:space-y-10">
          {administrationOfficeSections.map((section) => (
            <div key={section.id}>
              <h3 className="mb-4 text-sm font-black uppercase tracking-tighter text-maroon sm:mb-5 sm:text-base">
                {section.title}
              </h3>
              <StaffGrid>
                {section.members.map((member: AdministrationMember, index) => (
                  <StaffCard
                    key={`${member.name}-${member.role}`}
                    name={member.name}
                    role={member.role}
                    index={index}
                  />
                ))}
              </StaffGrid>
            </div>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock id="faculty" title="Faculty">
        <div className="mb-5">
          <label className="relative block max-w-lg">
            <span className="sr-only">Search faculty</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
            <input
              type="search"
              value={facultyQuery}
              onChange={(event) => setFacultyQuery(event.target.value)}
              placeholder="Search faculty..."
              className="w-full rounded-2xl border border-ink/15 bg-white py-3 pl-11 pr-4 text-sm font-bold text-ink shadow-sm placeholder:text-ink/35 focus:border-maroon/30 focus:outline-none focus:ring-2 focus:ring-maroon/15"
            />
          </label>
        </div>

        {filteredFaculty.length === 0 ? (
          <p className="text-sm font-bold text-ink/55">No results found.</p>
        ) : (
          <StaffGrid>
            {filteredFaculty.map((name, index) => (
              <StaffCard key={name} name={name} index={index} />
            ))}
          </StaffGrid>
        )}
      </SectionBlock>

      <SectionBlock id="accreditation" title="Area Accreditation Task Force">
        <div className="space-y-8 sm:space-y-10">
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

          <div className="space-y-8 sm:space-y-10">
            {accreditationAreas.map((area) => (
              <div key={area.area}>
                <h3 className="mb-4 text-sm font-black uppercase tracking-tighter text-maroon sm:mb-5 sm:text-base">
                  {area.area}
                </h3>
                <StaffGrid>
                  {area.members.map((member, index) => (
                    <StaffCard
                      key={`${area.area}-${member}`}
                      name={member}
                      index={index}
                    />
                  ))}
                </StaffGrid>
              </div>
            ))}
          </div>
        </div>
      </SectionBlock>
    </div>
  );
}
