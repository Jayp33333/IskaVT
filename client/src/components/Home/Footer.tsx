import React from "react";
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
      hover: "hover:bg-[#1877F2] hover:text-white", // Facebook blue
    },
    {
      icon: Twitter,
      href: "#",
      hover: "hover:bg-[#1DA1F2] hover:text-white", // Twitter blue
    },
    {
      icon: Instagram,
      href: "#",
      hover:
        "hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:text-white", // Instagram gradient
    },
    {
      icon: Github,
      href: "#",
      hover: "hover:bg-[#333] hover:text-white", // GitHub dark
    },
  ];

  return (
    <footer className="bg-black text-white pt-24 pb-12 px-6 lg:px-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#800000] rounded-full blur-[120px] opacity-20 pointer-events-none" />

      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          {/* LEFT SIDE */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <img
                src="/images/iska-logo.png"
                alt="Logo"
                className="h-10 brightness-0 invert"
              />
              <span className="bg-[#FFD700] text-black font-black px-3 py-1 rounded-md text-xs uppercase tracking-tighter rotate-2">
                PUP LOPEZ 3D
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
              Building the future of <br />
              <span className="text-[#FFD700]">Campus Life.</span>
            </h2>

            <div className="flex gap-4">
              {socialLinks.map((item, i) => {
                const Icon = item.icon;

                return (
                  <motion.a
                    key={i}
                    href={item.href}
                    whileHover={{ y: -5, rotate: 5 }}
                    className={`w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center rounded-xl transition-all ${item.hover}`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="relative">
            <div className="bg-[#1A1A1A] border-4 border-[#333] p-8 rounded-[32px] relative z-10">
              <h3 className="text-xl font-black uppercase mb-4 tracking-tight">
                Stay in the Loop
              </h3>
              <p className="text-gray-400 font-bold mb-6">
                Receive updates on new building models and features.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-black border-2 border-white/20 p-4 rounded-xl font-bold focus:border-[#FFD700] outline-none transition-colors"
                />
                <button className="bg-[#800000] border-2 border-black px-6 py-4 rounded-xl font-black uppercase text-xs flex items-center justify-center gap-2 hover:bg-[#991b1b] transition-colors">
                  Join <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

           
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t-2 border-white/10 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-wrap justify-center gap-8 text-sm font-black uppercase tracking-widest text-gray-400">
            {["Privacy", "Terms", "Documentation", "Feedback"].map((link) => (
              <a
                key={link}
                href="#"
                className="hover:text-[#FFD700] transition-colors"
              >
                {link}
              </a>
            ))}
          </div>

          <p className="text-gray-500 font-bold text-sm flex items-center gap-2">
            © 2026 Made with{" "}
            <Heart className="w-4 h-4 text-[#800000] fill-[#800000]" /> by DIT
            Students
          </p>

          <button
            onClick={navigateToTop}
            className="group flex items-center gap-2 font-black uppercase text-xs tracking-tighter text-[#FFD700]"
          >
            Back to top
            <div className="w-8 h-8 border-2 border-[#FFD700] rounded-full flex items-center justify-center group-hover:-translate-y-1 transition-transform">
              <ArrowUpRight className="w-4 h-4 rotate-[-45deg]" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
