import { motion } from "framer-motion";
import {
  Facebook,
  Twitter,
  Instagram,
  Github,
  ArrowUpRight,
  Heart,
} from "lucide-react";

export function Footer() {
  const navigateToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socialLinks = [
    {
      icon: Facebook,
      href: "#",
      hover: "hover:bg-[#1877F2] hover:text-white",
    },
    {
      icon: Twitter,
      href: "#",
      hover: "hover:bg-[#1DA1F2] hover:text-white",
    },
    {
      icon: Instagram,
      href: "#",
      hover:
        "hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:text-white",
    },
    {
      icon: Github,
      href: "#",
      hover: "hover:bg-[#333] hover:text-white",
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-black px-4 pb-8 pt-16 text-white sm:px-6 sm:pb-10 sm:pt-20 lg:px-12 lg:pb-12 lg:pt-24 xl:px-20">
      <div className="pointer-events-none absolute top-0 right-0 h-48 w-48 rounded-full bg-[#800000] opacity-20 blur-[120px] sm:h-64 sm:w-64" />

      <div className="container relative mx-auto">
        <div className="mb-10 grid grid-cols-1 gap-8 sm:mb-12 sm:gap-10 lg:mb-16 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-5 sm:space-y-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <img
                src="/images/iska-logo.png"
                alt="Logo"
                className="h-8 brightness-0 invert sm:h-9 lg:h-10"
              />
              <span className="rotate-2 rounded-md bg-[#FFD700] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-tighter text-black sm:px-3 sm:py-1 sm:text-xs">
                PUP LOPEZ 3D
              </span>
            </div>

            <h2 className="text-2xl font-black uppercase leading-none tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl">
              Building the future of <br />
              <span className="text-[#FFD700]">Campus Life.</span>
            </h2>

            <div className="flex gap-3 sm:gap-4">
              {socialLinks.map((item, i) => {
                const Icon = item.icon;

                return (
                  <motion.a
                    key={i}
                    href={item.href}
                    whileHover={{ y: -4, rotate: 5 }}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-white/10 backdrop-blur-md transition-all sm:h-11 sm:w-11 sm:rounded-xl ${item.hover}`}
                  >
                    <Icon className="h-4 w-4 text-white sm:h-5 sm:w-5" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 rounded-2xl border-2 border-[#333] bg-[#1A1A1A] p-5 sm:rounded-[28px] sm:border-4 sm:p-6 lg:rounded-[32px] lg:p-8">
              <h3 className="mb-2 text-base font-black uppercase tracking-tight sm:mb-3 sm:text-lg lg:text-xl">
                Stay in the Loop
              </h3>
              <p className="mb-4 text-sm font-bold text-gray-400 sm:mb-5 sm:text-base">
                Receive updates on new building models and features.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 rounded-lg border-2 border-white/20 bg-black p-3 text-sm font-bold outline-none transition-colors focus:border-[#FFD700] sm:rounded-xl sm:p-3.5 sm:text-base"
                />
                <button className="flex items-center justify-center gap-2 rounded-lg border-2 border-black bg-[#800000] px-5 py-3 text-[10px] font-black uppercase transition-colors hover:bg-[#991b1b] sm:rounded-xl sm:px-6 sm:py-3.5 sm:text-xs">
                  Join <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-5 border-t-2 border-white/10 pt-8 sm:gap-6 sm:pt-10 md:flex-row">
          <div className="flex flex-wrap justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400 sm:gap-6 sm:text-xs">
            {["Privacy", "Terms", "Documentation", "Feedback"].map((link) => (
              <a
                key={link}
                href="#"
                className="transition-colors hover:text-[#FFD700]"
              >
                {link}
              </a>
            ))}
          </div>

          <p className="flex items-center gap-2 text-xs font-bold text-gray-500 sm:text-sm">
            © 2026 Made with{" "}
            <Heart className="h-3.5 w-3.5 fill-[#800000] text-[#800000] sm:h-4 sm:w-4" /> by DIT
            Students
          </p>

          <button
            onClick={navigateToTop}
            className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-[#FFD700] sm:text-xs"
          >
            Back to top
            <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#FFD700] transition-transform group-hover:-translate-y-1 sm:h-8 sm:w-8">
              <ArrowUpRight className="h-3.5 w-3.5 rotate-[-45deg] sm:h-4 sm:w-4" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
