import { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { HiChevronDown } from "react-icons/hi2";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { aboutNavLinks } from "./data/pupLopezContent";
export const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const logo = "/images/iska-logo.png";
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isAboutPupSection =
    pathname.startsWith("/about") || pathname === "/programs";

  const sectionLink = (id: string) => (pathname === "/" ? `#${id}` : `/#${id}`);

  const homeNavLinks = [
    { name: "Home", href: sectionLink("home") },
    { name: "Features", href: sectionLink("features") },
    { name: "Contact", href: sectionLink("contact") },
  ];

  const navLinkClass = (active: boolean) =>
    `font-black uppercase text-sm tracking-tighter transition-colors relative group ${
      active ? "text-[#800000]" : "text-black hover:text-[#800000]"
    }`;

  const closeMobile = () => {
    setIsOpen(false);
    setMobileAboutOpen(false);
  };

  return (
    <nav className="bg-[#FFFDF5] border-b-4 border-black fixed top-0 w-full z-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
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
              <div className="absolute -inset-2 bg-[#FFD700] rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 z-0" />
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-10">
            {homeNavLinks.map((link) => (
              <a key={link.name} href={link.href} className={navLinkClass(false)}>
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-1 bg-[#FFD700] transition-all group-hover:w-full" />
              </a>
            ))}

            <div
              className="relative"
              onMouseEnter={() => setAboutOpen(true)}
              onMouseLeave={() => setAboutOpen(false)}
            >
              <div className="flex items-center gap-1 select-none">
                <span
                  className={`font-black uppercase text-sm tracking-tighter relative group ${
                    isAboutPupSection ? "text-[#800000]" : "text-black"
                  }`}
                >
                  ABOUT PUPLQ
                  <span className="absolute -bottom-1 left-0 w-0 h-1 bg-[#FFD700] transition-all group-hover:w-full" />
                </span>
                <HiChevronDown
                  className={`w-4 h-4 text-black transition-transform ${aboutOpen ? "rotate-180" : ""}`}
                />
              </div>

              <AnimatePresence>
                {aboutOpen && (
                  <div className="absolute top-full left-0 pt-3">
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="min-w-[200px] bg-white border-4 border-black rounded-xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                    >
                      {aboutNavLinks.map((link) => (
                        <Link
                          key={link.path}
                          to={link.path}
                          onClick={() => setAboutOpen(false)}
                          className={`block px-5 py-3 font-black uppercase text-xs tracking-tight transition-colors border-b-2 border-black/10 last:border-b-0 ${
                            pathname === link.path
                              ? "bg-[#800000] text-white"
                              : "text-black hover:bg-[#FFD700]"
                          }`}
                        >
                          {link.name}
                        </Link>
                      ))}
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="hidden md:block">
            <button
              onClick={() => navigate("/experience")}
              className="relative bg-black rounded-xl group transition-all"
            >
              <span className="absolute inset-0 bg-black rounded-xl translate-y-1 translate-x-1" />
              <span className="relative inline-flex items-center gap-2 bg-[#800000] border-2 border-black text-white font-black uppercase text-xs tracking-widest px-6 py-3 rounded-xl -translate-y-1 -translate-x-1 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform">
                LAUNCH 3D TOUR
              </span>
            </button>
          </div>

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

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobile}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-110"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 flex h-full w-[min(88vw,300px)] flex-col border-l-4 border-black bg-[#FFFDF5] z-120 sm:w-[min(80vw,320px)] sm:border-l-8"
            >
              <div className="flex shrink-0 items-center justify-between border-b-2 border-black/10 px-4 py-4 sm:px-6 sm:py-5">
                <img src={logo} alt="Logo" className="h-7 sm:h-8" />
                <button
                  onClick={closeMobile}
                  className="rounded-lg border-2 border-black bg-white p-1.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:rounded-xl sm:border-4 sm:p-2"
                  aria-label="Close menu"
                >
                  <HiOutlineX className="text-lg sm:text-xl" />
                </button>
              </div>

              <div className="flex flex-1 flex-col overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-3 sm:gap-4">
                  {homeNavLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={closeMobile}
                      className="group flex items-center gap-3 text-xl font-black uppercase tracking-tighter text-black hover:text-[#800000] sm:text-2xl"
                    >
                      <span className="h-3 w-0 bg-[#FFD700] transition-all group-hover:w-5 sm:group-hover:w-6" />
                      {link.name}
                    </a>
                  ))}

                  <div>
                    <button
                      type="button"
                      onClick={() => setMobileAboutOpen((open) => !open)}
                      className={`group flex w-full items-center gap-3 text-xl font-black uppercase tracking-tighter sm:text-2xl ${
                        isAboutPupSection
                          ? "text-[#800000]"
                          : "text-black hover:text-[#800000]"
                      }`}
                    >
                      <span className="h-3 w-0 bg-[#FFD700] transition-all group-hover:w-5 sm:group-hover:w-6" />
                      ABOUT PUPLQ
                      <HiChevronDown
                        className={`ml-auto h-5 w-5 shrink-0 transition-transform sm:h-6 sm:w-6 ${mobileAboutOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    <AnimatePresence>
                      {mobileAboutOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-2 space-y-2 overflow-hidden pl-8 sm:mt-3 sm:pl-10"
                        >
                          {aboutNavLinks.map((link) => (
                            <Link
                              key={link.path}
                              to={link.path}
                              onClick={closeMobile}
                              className={`block text-sm font-black uppercase tracking-tight sm:text-base ${
                                pathname === link.path
                                  ? "text-[#800000]"
                                  : "text-black/70 hover:text-[#800000]"
                              }`}
                            >
                              {link.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="mt-6 sm:mt-8">
                  <button
                    onClick={() => {
                      closeMobile();
                      navigate("/experience");
                    }}
                    className="w-full rounded-xl bg-black p-0.5 sm:rounded-2xl sm:p-1"
                  >
                    <span className="block w-full rounded-lg border-2 border-black bg-[#800000] py-3 text-center text-xs font-black uppercase tracking-widest text-white -translate-x-1 -translate-y-1 transition-transform active:translate-x-0 active:translate-y-0 sm:rounded-xl sm:border-4 sm:py-4 sm:text-sm">
                      Launch 3D Tour
                    </span>
                  </button>
                </div>
              </div>

              <div className="shrink-0 border-t-2 border-black/10 px-4 py-4 sm:px-6 sm:py-5">
                <div className="rounded-xl border-2 border-black bg-[#FFD700] px-4 py-3 sm:rounded-2xl sm:border-4 sm:px-5 sm:py-4">
                  <p className="text-center text-[10px] font-black uppercase tracking-widest sm:text-xs">
                    PUP Lopez Campus v2.0
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};
