import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Mail, Sparkles } from "lucide-react";
import { Section } from "../marketing";
import { homeCtaContent, homeWelcomeContent } from "./data/homeContent";

export function HomeCta() {
  const navigate = useNavigate();

  const secondaryLinkClass =
    "inline-flex items-center gap-2 rounded-xl border-4 border-ink bg-cream px-5 py-3 text-sm font-black uppercase tracking-tighter text-ink transition-colors hover:bg-ink hover:text-white sm:rounded-2xl sm:px-6";

  return (
    <Section id="cta" variant="white" dotGrid>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="overflow-hidden rounded-2xl border-2 border-ink bg-white shadow-brutal-lg sm:rounded-3xl sm:border-4"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="p-6 sm:p-8 lg:p-10">
            <h2 className="mb-4 text-3xl font-black uppercase leading-tight tracking-tighter text-ink sm:text-4xl">
              {homeCtaContent.title}{" "}
              <span className="text-maroon">{homeCtaContent.highlight}</span>
            </h2>
            <p className="mb-6 max-w-lg text-sm font-bold leading-relaxed text-ink/70 sm:text-base">
              {homeCtaContent.description}
            </p>

            <div className="flex flex-wrap gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => navigate("/experience")}
                className="group inline-flex items-center gap-2 rounded-xl border-4 border-ink bg-maroon px-5 py-3 text-sm font-black uppercase tracking-tighter text-white shadow-brutal-sm transition-colors hover:bg-maroon/90 sm:rounded-2xl sm:px-6"
              >
                Start Tour
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <Link to="/features" className={secondaryLinkClass}>
                <Sparkles className="h-4 w-4" />
                View Features
              </Link>

              <Link to="/about" className={secondaryLinkClass}>
                <BookOpen className="h-4 w-4" />
                About Campus
              </Link>

              <Link to="/contact" className={secondaryLinkClass}>
                <Mail className="h-4 w-4" />
                Contact Us
              </Link>
            </div>

            <p className="mt-6 text-xs font-bold leading-relaxed text-ink/50 sm:text-sm">
              Developed by{" "}
              <span className="font-black text-ink/70">
                {homeWelcomeContent.projectDevelopers.members
                  .map((member) => member.name)
                  .join(", ")}
              </span>{" "}
              — {homeWelcomeContent.projectDevelopers.program}
            </p>
          </div>

          <div className="relative min-h-[200px] border-t-2 border-ink bg-muted lg:border-l-2 lg:border-t-0">
            <img
              src="/images/campus-renderer.png"
              alt="3D Campus Preview"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-transparent lg:bg-gradient-to-l lg:from-white/80" />
            <div className="absolute bottom-3 left-3 rounded-lg border-2 border-ink bg-gold px-3 py-1.5 text-[10px] font-black uppercase tracking-tighter text-ink shadow-brutal-sm sm:bottom-4 sm:left-4 sm:border-4 sm:text-xs">
              3D Campus Preview
            </div>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}
