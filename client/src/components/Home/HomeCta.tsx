import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Mail, Sparkles } from "lucide-react";
import { Section } from "../marketing";
import { homeCtaContent } from "./data/homeContent";

export function HomeCta() {
  return (
    <Section id="cta" variant="dark" className="bg-ink">
      <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full bg-maroon/30 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="overflow-hidden rounded-2xl border-2 border-gold bg-dark-panel sm:rounded-[2rem] sm:border-4"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="p-6 sm:p-8 lg:p-10">
            <h2 className="mb-4 text-3xl font-black uppercase leading-tight tracking-tighter text-white sm:text-4xl">
              {homeCtaContent.title}{" "}
              <span className="text-gold">{homeCtaContent.highlight}</span>
            </h2>
            <p className="mb-6 max-w-lg text-sm font-bold leading-relaxed text-white/70 sm:text-base">
              {homeCtaContent.description}
            </p>

            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Link
                to="/features"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-5 py-3 text-sm font-black uppercase tracking-tighter text-white transition-colors hover:border-gold hover:text-gold sm:rounded-2xl sm:px-6"
              >
                <Sparkles className="h-4 w-4" />
                View Features
              </Link>

              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-5 py-3 text-sm font-black uppercase tracking-tighter text-white transition-colors hover:border-gold hover:text-gold sm:rounded-2xl sm:px-6"
              >
                <BookOpen className="h-4 w-4" />
                About Campus
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-5 py-3 text-sm font-black uppercase tracking-tighter text-white transition-colors hover:border-gold hover:text-gold sm:rounded-2xl sm:px-6"
              >
                <Mail className="h-4 w-4" />
                Contact Us
              </Link>
            </div>
          </div>

          <div className="relative min-h-[200px] border-t-2 border-gold/30 lg:border-l-2 lg:border-t-0">
            <img
              src="/images/campus-renderer.png"
              alt="3D Campus Preview"
              className="absolute inset-0 h-full w-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:bg-gradient-to-l" />
          </div>
        </div>
      </motion.div>
    </Section>
  );
}
