import { motion } from "framer-motion";
import { BookOpen, Download, ExternalLink } from "lucide-react";
import { PageHeader, Section } from "../marketing";
import {
  handbookHighlights,
  handbookPageIntro,
  STUDENT_HANDBOOK_EMBED_URL,
  STUDENT_HANDBOOK_DOWNLOAD_URL,
  STUDENT_HANDBOOK_VIEW_URL,
} from "./data/resourcesContent";

export function Handbook() {
  return (
    <Section id="handbook" dotGrid>
      <PageHeader
        title={
          <>
            Student <span className="text-maroon">Handbook</span>
          </>
        }
        description={handbookPageIntro.description}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="overflow-hidden rounded-2xl border border-black bg-white shadow-[8px_8px_0px_0px_rgba(255,215,0,1)] sm:rounded-[2rem]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-5">
          <div className="border-b border-black p-5 sm:p-6 lg:col-span-2 lg:border-b-0 lg:border-r lg:p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-black bg-maroon sm:h-12 sm:w-12 sm:rounded-2xl">
                <BookOpen className="h-5 w-5 text-white sm:h-6 sm:w-6" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tighter text-black sm:text-2xl">
                PUP <span className="text-maroon">Student Handbook</span>
              </h2>
            </div>

            <p className="mb-5 text-sm font-bold leading-relaxed text-black/70 sm:text-base">
              {handbookPageIntro.summary}
            </p>

            <div className="space-y-3 rounded-xl border border-black bg-cream p-4 sm:rounded-2xl sm:p-5">
              <p className="text-[10px] font-black uppercase tracking-widest text-black/50 sm:text-xs">
                What you&apos;ll find inside
              </p>
              <ul className="space-y-2">
                {handbookHighlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm font-bold text-black/75 sm:text-base"
                  >
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full border border-black bg-gold" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={STUDENT_HANDBOOK_VIEW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-black bg-gold px-4 py-2.5 text-xs font-black uppercase tracking-tighter text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none sm:rounded-2xl sm:px-5 sm:py-3 sm:text-sm"
              >
                Open in Google Drive
                <ExternalLink className="h-4 w-4" />
              </a>
              <a
                href={STUDENT_HANDBOOK_DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-black bg-white px-4 py-2.5 text-xs font-black uppercase tracking-tighter text-black shadow-[3px_3px_0px_0px_rgba(128,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none sm:rounded-2xl sm:px-5 sm:py-3 sm:text-sm"
              >
                Download PDF
                <Download className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="relative min-h-[420px] bg-[#F5F5F5] sm:min-h-[520px] lg:col-span-3 lg:min-h-[640px]">
            <iframe
              title="PUP Student Handbook"
              src={STUDENT_HANDBOOK_EMBED_URL}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              allowFullScreen
            />
          </div>
        </div>
      </motion.div>
    </Section>
  );
}
