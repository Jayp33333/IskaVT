import { homeWelcomeContent } from "../data/homeContent";
import { developersPageIntro } from "../data/resourcesContent";

export function buildDevelopersSpeechText(): string {
  const { members } = homeWelcomeContent.projectDevelopers;

  const memberText = members
    .map((member) => {
      const focus =
        member.focus.length > 0
          ? ` Focus areas: ${member.focus.join(", ")}.`
          : "";

      return `${member.name}. ${member.role}. ${member.bio}${focus}`;
    })
    .join(" ");

  return [
    "Meet Our Team.",
    developersPageIntro.description,
    memberText,
  ].join(" ");
}
