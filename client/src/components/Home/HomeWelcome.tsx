import { motion } from "framer-motion";
import { Box } from "lucide-react";
import { PageHeader, Section } from "../marketing";
import { homeWelcomeContent } from "./data/homeContent";

export function HomeWelcome() {
  return (
    <Section id="welcome" variant="white">
      <div className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />

      <PageHeader
        title={
          <>
            Welcome to the <span className="text-maroon">Virtual Campus</span>
          </>
        }
        description={homeWelcomeContent.headline}
        className="mb-8 sm:mb-10"
      />

      <motion.article
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="overflow-hidden rounded-2xl border-2 border-ink bg-cream shadow-brutal-maroon sm:rounded-[2rem] sm:border-4"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px]">
          <div className="space-y-4 p-5 sm:space-y-5 sm:p-6 lg:p-8">
            {homeWelcomeContent.paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="text-sm font-bold leading-relaxed text-ink/70 sm:text-base"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="flex flex-col items-center justify-center border-t-2 border-ink bg-maroon p-6 text-white sm:p-8 lg:border-l-4 lg:border-t-0">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-ink bg-gold shadow-brutal-sm sm:h-20 sm:w-20 sm:rounded-3xl sm:border-4">
              <Box className="h-8 w-8 text-ink sm:h-10 sm:w-10" />
            </div>
            <p className="text-center text-lg font-black uppercase tracking-tighter sm:text-xl">
              ISKA VT
            </p>
            <p className="mt-2 text-center text-xs font-bold text-white/80 sm:text-sm">
              PUP Lopez 3D Campus Experience
            </p>
          </div>
        </div>
      </motion.article>
    </Section>
  );
}
