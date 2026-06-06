import { Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { PageHeader, Section, SpeakTextButton } from "../marketing";
import { InspiredValuesGrid } from "./InspiredValuesGrid";
import { StrategicGoalsGrid } from "./StrategicGoalsGrid";
import { HymnsContent } from "./HymnsContent";
import { YouTubeEmbed } from "./YouTubeEmbed";
import {
  aboutContent,
  defaultAboutSection,
  isAboutSectionId,
  type AboutContentBlock,
} from "./data/pupLopezContent";

function renderContent(content: AboutContentBlock) {
  if (content.type === "paragraph") {
    return (
      <p className="text-lg text-ink/70 font-bold leading-relaxed">
        {content.text}
      </p>
    );
  }

  if (content.type === "list") {
    return (
      <div className="space-y-4">
        {content.intro && (
          <p className="text-lg text-ink/70 font-bold leading-relaxed">
            {content.intro}
          </p>
        )}
        <ul className="space-y-3">
          {content.items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 text-black/70 font-bold leading-relaxed"
            >
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#800000]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (content.type === "inspired-values") {
    return <InspiredValuesGrid />;
  }

  if (content.type === "strategic-goals") {
    return <StrategicGoalsGrid />;
  }

  if (content.type === "hymns") {
    return <HymnsContent />;
  }

  if (content.type === "sections-with-video") {
    return (
      <div className="space-y-10">
        {content.sections.map((section) => (
          <div key={section.title}>
            <h4 className="mb-4 text-xl font-black uppercase tracking-tighter text-black">
              {section.title}
            </h4>
            {renderContent(section.content)}
          </div>
        ))}

        <div>
          <h4 className="mb-4 text-xl font-black uppercase tracking-tighter text-black">
            Video
          </h4>
          <YouTubeEmbed
            videoId={content.youtubeId}
            title={content.videoTitle ?? "Vision and Mission Video"}
          />
        </div>
      </div>
    );
  }

  if (content.type === "sections") {
    return (
      <div className="space-y-10">
        {content.sections.map((section) => (
          <div key={section.title}>
            <h4 className="text-xl font-black uppercase tracking-tighter text-black mb-4">
              {section.title}
            </h4>
            {renderContent(section.content)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5 max-h-[520px] overflow-y-auto pr-2">
      {content.items.map((paragraph) => (
        <p
          key={paragraph.slice(0, 48)}
          className="text-lg text-black/70 font-bold leading-relaxed"
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export function About() {
  const { section } = useParams<{ section: string }>();

  if (!section) {
    return <Navigate to={`/about/${defaultAboutSection}`} replace />;
  }

  if (!isAboutSectionId(section)) {
    return <Navigate to={`/about/${defaultAboutSection}`} replace />;
  }

  const page = aboutContent[section];
  const historySpeechText =
    section === "history" && page.content.type === "paragraphs"
      ? [page.title, ...page.content.items].join(". ")
      : null;

  return (
    <Section id="about" dotGrid>
      <PageHeader
        title={
          <>
            About <span className="text-maroon">Our Campus</span>
          </>
        }
        description="Learn about our vision, mission, values, and the history that shaped PUP Lopez into a premier campus in the region."
        backLink={{ to: "/about", label: "← Back to About Overview" }}
      />

      <motion.div
        key={section}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className={`mx-auto rounded-[32px] p-8 md:p-12 ${
          section === "values" || section === "goals" || section === "hymn"
            ? "max-w-6xl bg-transparent"
            : "max-w-4xl border-4 border-ink bg-white shadow-brutal-gold-lg"
        }`}
      >
          {section !== "hymn" && (
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-3xl font-black uppercase tracking-tighter text-[#800000] md:text-4xl">
                {page.title}
              </h3>
              {historySpeechText && <SpeakTextButton text={historySpeechText} />}
            </div>
          )}
          {renderContent(page.content)}
        </motion.div>
    </Section>
  );
}
