import { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const logo = "/images/iska-logo.png";
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Features", href: "#features" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className="bg-[#FFFDF5] border-b-4 border-black fixed top-0 w-full z-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* --- LOGO AREA --- */}
          <div
            className="shrink-0 group cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="relative">
              <img
                src={logo}
                alt="Logo"
                className="h-8 md:h-10 relative z-10"
              />
              {/* Playful background blob on logo hover */}
              <div className="absolute -inset-2 bg-[#FFD700] rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 z-0" />
            </div>
          </div>

          {/* --- DESKTOP NAV --- */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-black font-black uppercase text-sm tracking-tighter hover:text-[#800000] transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-1 bg-[#FFD700] transition-all group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* --- DESKTOP CTA --- */}
          <div className="hidden md:block">
            <button
              onClick={() => navigate("/experience")}
              className="relative bg-black rounded-xl group transition-all"
            >
              {/* The "Bottom" Shadow Layer */}
              <span className="absolute inset-0 bg-black rounded-xl translate-y-1 translate-x-1"></span>

              {/* The "Top" Interactive Layer */}
              <span className="relative inline-flex items-center gap-2 bg-[#800000] border-2 border-black text-white font-black uppercase text-xs tracking-widest px-6 py-3 rounded-xl -translate-y-1 -translate-x-1 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform">
                Visit App
              </span>
            </button>
          </div>

          {/* --- MOBILE HAMBURGER --- */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(true)}
              className="bg-[#FFD700] border-4 border-black p-2 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
            >
              <HiOutlineMenu className="text-2xl text-black" />
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE SIDEBAR --- */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-110"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[80%] max-w-sm bg-[#FFFDF5] border-l-8 border-black z-120 p-8"
            >
              <div className="flex justify-between items-center mb-12">
                <img src={logo} alt="Logo" className="h-8" />
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-white border-4 border-black p-2 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  <HiOutlineX className="text-xl" />
                </button>
              </div>

              <div className="flex flex-col space-y-6">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-4xl font-black uppercase tracking-tighter text-black hover:text-[#800000] flex items-center gap-4 group"
                  >
                    <span className="w-0 h-4 bg-[#FFD700] group-hover:w-8 transition-all" />
                    {link.name}
                  </a>
                ))}

                <div className="pt-10">
                  <button
                    onClick={() => navigate("/experience")}
                    className="w-full bg-black p-1 rounded-2xl"
                  >
                    <span className="block w-full bg-[#800000] border-4 border-black text-white font-black uppercase py-5 rounded-xl -translate-y-2 -translate-x-2 active:translate-y-0 active:translate-x-0 transition-transform text-center">
                      Launch 3D Tour
                    </span>
                  </button>
                </div>
              </div>

              {/* Decorative bottom element for sidebar */}
              <div className="absolute bottom-10 left-8 right-8 p-6 bg-[#FFD700] border-4 border-black rounded-2xl">
                <p className="font-black text-xs uppercase tracking-widest text-center">
                  PUP Lopez Campus v2.0
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};
