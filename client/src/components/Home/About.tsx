import { Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CampusSubtitle } from "./CampusSubtitle";
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
      <p className="text-lg text-black/70 font-bold leading-relaxed">
        {content.text}
      </p>
    );
  }

  if (content.type === "list") {
    return (
      <div className="space-y-4">
        {content.intro && (
          <p className="text-lg text-black/70 font-bold leading-relaxed">
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

  return (
    <section
      className="py-32 px-6 lg:px-20 bg-[#FFFDF5] relative overflow-hidden"
      id="about"
    >
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#FFD700]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto">
        <div className="flex flex-col items-center mb-12 text-center">
          <CampusSubtitle />
          <h2 className="text-5xl md:text-6xl font-black text-black leading-[0.9] mb-6 uppercase tracking-tighter">
            About <span className="text-[#800000]">Our Campus</span>
          </h2>
          <p className="max-w-2xl text-black/60 font-bold text-lg">
            Learn about our vision, mission, values, and the history that shaped
            PUP Lopez into a premier campus in the region.
          </p>
        </div>

        <motion.div
          key={section}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className={`mx-auto rounded-[32px] p-8 md:p-12 ${
            section === "values" || section === "goals" || section === "hymn"
              ? "max-w-6xl bg-transparent"
              : "max-w-4xl border-4 border-black bg-white shadow-[16px_16px_0px_0px_rgba(255,215,0,1)]"
          }`}
        >
          {section !== "hymn" && (
            <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-[#800000] mb-6">
              {page.title}
            </h3>
          )}
          {renderContent(page.content)}
        </motion.div>
      </div>
    </section>
  );
}
