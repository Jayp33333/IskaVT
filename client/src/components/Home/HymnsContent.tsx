import { motion } from "framer-motion";
import { hymnContent } from "./data/hymnContent";
import { YouTubeEmbed } from "./YouTubeEmbed";

export function HymnsContent() {
  return (
    <div className="space-y-8 sm:space-y-10">
      {hymnContent.map((hymn, hymnIndex) => (
        <motion.article
          key={hymn.title}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: hymnIndex * 0.05 }}
          className="overflow-hidden rounded-2xl border border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:rounded-3xl"
        >
          <div className="border-b border-black bg-[#800000] px-5 py-4 sm:border-b sm:px-6 sm:py-5">
            <h4 className="text-lg font-black uppercase tracking-tighter text-white sm:text-xl md:text-2xl">
              {hymn.title}
            </h4>
            {hymn.subtitle && (
              <p className="mt-1 text-sm font-bold text-[#FFD700] sm:text-base">
                {hymn.subtitle}
              </p>
            )}
            {hymn.authors && (
              <p className="mt-2 text-xs font-bold text-white/75 sm:text-sm">
                {hymn.authors}
              </p>
            )}
            {hymn.note && (
              <p className="mt-2 text-xs font-bold italic text-white/70 sm:text-sm">
                ({hymn.note})
              </p>
            )}
          </div>

          <div className="space-y-6 px-5 py-6 sm:space-y-8 sm:px-6 sm:py-8">
            {hymn.stanzas.map((stanza, stanzaIndex) => (
              <div
                key={`${hymn.title}-stanza-${stanzaIndex}`}
                className="text-center"
              >
                {stanza.map((line) => (
                  <p
                    key={`${hymn.title}-${stanzaIndex}-${line}`}
                    className="text-sm font-bold leading-relaxed text-black/80 sm:text-base md:text-lg"
                  >
                    {line}
                  </p>
                ))}
              </div>
            ))}
            {hymn.youtubeId && (
              <div className="pt-2">
                <YouTubeEmbed
                  videoId={hymn.youtubeId}
                  title={hymn.videoTitle ?? hymn.title}
                />
              </div>
            )}
          </div>
        </motion.article>
      ))}
    </div>
  );
}
