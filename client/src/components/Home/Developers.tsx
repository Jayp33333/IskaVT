import { useState } from "react";
import { motion } from "framer-motion";
import { Facebook } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHeader, Section } from "../marketing";
import { homeWelcomeContent } from "./data/homeContent";
import { developersPageIntro } from "./data/resourcesContent";

const socialIcons: Record<string, LucideIcon> = {
  facebook: Facebook,
};

const fallbackImages = [
  "/images/iska-profile.png",
  "/images/headIconGirl.png",
  "/images/headIconBoy.png",
  "/images/isko-head-icon.png",
] as const;

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

type DeveloperMember = (typeof homeWelcomeContent.projectDevelopers.members)[number];

function DeveloperPhoto({
  member,
  index,
}: {
  member: DeveloperMember;
  index: number;
}) {
  const [failedSources, setFailedSources] = useState<string[]>([]);
  const sources = [member.image, fallbackImages[index % fallbackImages.length]];
  const activeSrc = sources.find((src) => !failedSources.includes(src));

  if (!activeSrc) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-maroon">
        <span className="text-5xl font-black uppercase tracking-tighter text-white sm:text-6xl">
          {getInitials(member.name)}
        </span>
      </div>
    );
  }

  return (
    <img
      src={activeSrc}
      alt={member.name}
      className="h-full w-full object-cover object-top"
      onError={() =>
        setFailedSources((current) =>
          current.includes(activeSrc) ? current : [...current, activeSrc],
        )
      }
    />
  );
}

function DeveloperProfileCard({
  member,
  index,
}: {
  member: DeveloperMember;
  index: number;
}) {
  return (
    <motion.article
      id={member.slug}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="group mx-auto w-full max-w-[17rem] sm:max-w-none"
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl border-2 border-ink shadow-brutal-md transition-shadow group-hover:shadow-brutal-lg sm:rounded-3xl sm:border-4">
        <DeveloperPhoto member={member} index={index} />

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10" />

        <div className="absolute right-3 top-3 flex gap-1.5 sm:right-4 sm:top-4 sm:gap-2">
          {member.socials.map((social) => {
            const Icon = socialIcons[social.platform] ?? Facebook;
            const url = social.url.trim();
            const isPlaceholder = url === "" || url === "#";

            return (
              <a
                key={social.platform}
                href={url || "#"}
                target={isPlaceholder ? undefined : "_blank"}
                rel={isPlaceholder ? undefined : "noopener noreferrer"}
                aria-label={`${member.name} on ${social.platform}`}
                onClick={
                  isPlaceholder
                    ? (event) => event.preventDefault()
                    : undefined
                }
                className="flex h-8 w-8 items-center justify-center rounded-md border border-white/15 bg-black/45 text-white backdrop-blur-sm transition-colors hover:border-[#1877F2] hover:bg-[#1877F2] sm:h-9 sm:w-9"
              >
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </a>
            );
          })}
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <h2 className="text-lg font-black uppercase leading-tight tracking-tighter text-white sm:text-xl">
            {member.name}
          </h2>
          <p className="mt-1 text-xs font-bold text-white/85 sm:text-sm">
            {member.role}
          </p>
        </div>
      </div>
    </motion.article>
  );
}

export function Developers() {
  const { projectDevelopers } = homeWelcomeContent;

  return (
    <Section id="developers" dotGrid>
      <PageHeader
        title={
          <>
            Meet Our <span className="text-maroon">Team</span>
          </>
        }
        description={developersPageIntro.description}
      />

      <div className="grid grid-cols-1 gap-6 min-[480px]:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-4">
        {projectDevelopers.members.map((member, index) => (
          <DeveloperProfileCard key={member.slug} member={member} index={index} />
        ))}
      </div>
    </Section>
  );
}
