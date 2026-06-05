import { motion } from "framer-motion";
import {
  Facebook,
  Twitter,
  Instagram,
  Github,
  ArrowUpRight,
  Heart,
} from "lucide-react";
import { SectionDotGrid } from "../marketing/SectionDotGrid";
import { homeWelcomeContent } from "./data/homeContent";

export function Footer() {
  const navigateToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socialLinks = [
    { icon: Facebook, href: "#" },
    { icon: Twitter, href: "#" },
    { icon: Instagram, href: "#" },
    { icon: Github, href: "#" },
  ];

  return (
    <footer className="relative overflow-hidden border-t-4 border-ink bg-white px-4 pb-8 pt-16 text-ink sm:px-6 sm:pb-10 sm:pt-20 lg:px-12 lg:pb-12 lg:pt-24 xl:px-20">
      <SectionDotGrid tone="light" />

      <div className="pointer-events-none absolute -right-16 top-8 h-40 w-40 rounded-full bg-maroon/10 blur-[100px] sm:h-56 sm:w-56" />
      <div className="pointer-events-none absolute bottom-24 left-0 h-32 w-32 rounded-full bg-gold/20 blur-[80px]" />

      <div className="container relative mx-auto">
        <div className="mb-10 grid grid-cols-1 gap-8 sm:mb-12 sm:gap-10 lg:mb-16 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-5 sm:space-y-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <img
                src="/images/iska-logo.png"
                alt="ISKA Virtual Tour"
                className="h-8 sm:h-9 lg:h-10"
              />
              <span className="rotate-2 rounded-md border-2 border-ink bg-gold px-2.5 py-0.5 text-[10px] font-black uppercase tracking-tighter text-ink shadow-brutal-sm sm:border-4 sm:px-3 sm:py-1 sm:text-xs">
                PUP LOPEZ 3D
              </span>
            </div>

            <h2 className="text-2xl font-black uppercase leading-none tracking-tighter text-ink sm:text-3xl md:text-4xl lg:text-5xl">
              Building the future of <br />
              <span className="text-maroon">Campus Life.</span>
            </h2>

            <div className="flex gap-3 sm:gap-4">
              {socialLinks.map((item, i) => {
                const Icon = item.icon;

                return (
                  <motion.a
                    key={i}
                    href={item.href}
                    whileHover={{ y: -4, rotate: 5 }}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-ink bg-white text-ink shadow-brutal-sm transition-colors hover:border-ink hover:bg-ink hover:text-white sm:h-11 sm:w-11 sm:rounded-xl sm:border-4"
                  >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 rounded-2xl border-2 border-ink bg-white p-5 shadow-brutal-md sm:rounded-3xl sm:border-4 sm:p-6 lg:p-8">
              <h3 className="mb-2 text-base font-black uppercase tracking-tight text-ink sm:mb-3 sm:text-lg lg:text-xl">
                Stay in the Loop
              </h3>
              <p className="mb-4 text-sm font-bold text-ink/60 sm:mb-5 sm:text-base">
                Receive updates on new building models and features.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 rounded-lg border-2 border-ink bg-muted p-3 text-sm font-bold text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-maroon focus:bg-white sm:rounded-xl sm:border-4 sm:p-3.5 sm:text-base"
                />
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-lg border-2 border-ink bg-maroon px-5 py-3 text-[10px] font-black uppercase tracking-tighter text-white shadow-brutal-sm transition-colors hover:bg-maroon/90 sm:rounded-xl sm:border-4 sm:px-6 sm:py-3.5 sm:text-xs"
                >
                  Join <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-5 border-t-2 border-ink/15 pt-8 sm:gap-6 sm:pt-10 md:flex-row">
          <div className="flex flex-wrap justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-ink/50 sm:gap-6 sm:text-xs">
            {["Privacy", "Terms", "Documentation", "Feedback"].map((link) => (
              <a
                key={link}
                href="#"
                className="transition-colors hover:text-maroon"
              >
                {link}
              </a>
            ))}
          </div>

          <p className="flex items-center gap-2 text-xs font-bold text-ink/60 sm:text-sm">
            © 2026 Made with{" "}
            <Heart className="h-3.5 w-3.5 fill-maroon text-maroon sm:h-4 sm:w-4" />{" "}
            by {homeWelcomeContent.projectDevelopers.members[0].name} & Team
          </p>

          <button
            type="button"
            onClick={navigateToTop}
            className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-maroon sm:text-xs"
          >
            Back to top
            <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-ink bg-gold shadow-brutal-sm transition-transform group-hover:-translate-y-1 sm:h-8 sm:w-8 sm:border-4">
              <ArrowUpRight className="h-3.5 w-3.5 rotate-[-45deg] text-ink sm:h-4 sm:w-4" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
