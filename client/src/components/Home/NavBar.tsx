import { useEffect, useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { HiChevronDown } from "react-icons/hi2";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { aboutNavLinks } from "./data/pupLopezContent";
import { resourceNavLinks } from "./data/resourcesContent";

type NavDropdownProps = {
  label: string;
  active: boolean;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
  links: { name: string; path: string }[];
  pathname: string;
  align?: "left" | "right";
};

function NavDropdown({
  label,
  active,
  open,
  onOpen,
  onClose,
  onToggle,
  links,
  pathname,
  align = "left",
}: NavDropdownProps) {
  return (
    <div
      className="relative shrink-0"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-haspopup="true"
        className={`flex items-center gap-0.5 rounded-md px-1 py-1 font-black uppercase tracking-tighter transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon focus-visible:ring-offset-2 focus-visible:ring-offset-cream lg:text-xs xl:text-sm ${
          active ? "text-maroon" : "text-ink hover:text-maroon"
        }`}
      >
        <span className="relative whitespace-nowrap">{label}</span>
        <HiChevronDown
          className={`h-3.5 w-3.5 shrink-0 transition-transform xl:h-4 xl:w-4 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <div
            className={`absolute top-full z-50 pt-2 ${align === "right" ? "right-0" : "left-0"}`}
          >
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="max-h-[min(70vh,24rem)] min-w-[12.5rem] overflow-y-auto rounded-xl border-4 border-ink bg-white shadow-brutal-md"
            >
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={onClose}
                  className={`block border-b-2 border-ink/10 px-4 py-2.5 font-black uppercase tracking-tight transition-colors last:border-b-0 lg:text-[10px] xl:px-5 xl:py-3 xl:text-xs ${
                    pathname === link.path
                      ? "bg-maroon text-white"
                      : "text-ink hover:bg-gold"
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
  );
}

export const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const logo = "/images/iska-logo.png";
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isHomePage = pathname === "/home" || pathname === "/";
  const isFeaturesPage = pathname === "/features";
  const isAboutPupSection =
    pathname.startsWith("/about") || pathname === "/programs";
  const isContactPage = pathname === "/contact";
  const isResourcesSection = pathname.startsWith("/resources");

  const primaryNavLinks = [
    { name: "Home", href: "/home", active: isHomePage },
    { name: "Features", href: "/features", active: isFeaturesPage },
  ];

  const navLinkClass = (active: boolean) =>
    `relative shrink-0 whitespace-nowrap rounded-md px-1 py-1 font-black uppercase tracking-tighter transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon focus-visible:ring-offset-2 focus-visible:ring-offset-cream lg:text-xs xl:text-sm ${
      active ? "text-maroon" : "text-ink hover:text-maroon"
    }`;

  const closeMobile = () => {
    setIsOpen(false);
    setMobileAboutOpen(false);
    setMobileResourcesOpen(false);
  };

  const closeDesktopDropdowns = () => {
    setAboutOpen(false);
    setResourcesOpen(false);
  };

  useEffect(() => {
    closeMobile();
    closeDesktopDropdowns();
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <nav className="fixed top-0 z-100 w-full border-b-2 border-ink bg-cream sm:border-b-4">
      <div className="mx-auto max-w-7xl px-3 sm:px-5 lg:px-6 xl:px-8">
        <div className="flex h-14 items-center justify-between gap-2 sm:h-16 sm:gap-3 lg:h-[4.5rem] xl:h-20">
          <button
            type="button"
            className="group shrink-0 cursor-pointer rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon"
            onClick={() => navigate("/home")}
            aria-label="Go to home"
          >
            <div className="relative">
              <img
                src={logo}
                alt="ISKA Virtual Tour"
                className="relative z-10 h-7 w-auto sm:h-8 lg:h-9 xl:h-10"
              />
              <div className="absolute -inset-2 z-0 scale-0 rounded-full bg-gold transition-transform duration-300 group-hover:scale-100" />
            </div>
          </button>

          <div className="hidden min-w-0 flex-1 items-center justify-center gap-3 lg:flex xl:gap-5 2xl:gap-8">
            {primaryNavLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={navLinkClass(link.active)}
              >
                {link.name}
              </Link>
            ))}

            <NavDropdown
              label="About PUPLQ"
              active={isAboutPupSection}
              open={aboutOpen}
              onOpen={() => {
                setResourcesOpen(false);
                setAboutOpen(true);
              }}
              onClose={() => setAboutOpen(false)}
              onToggle={() => {
                setResourcesOpen(false);
                setAboutOpen((open) => !open);
              }}
              links={aboutNavLinks}
              pathname={pathname}
            />

            <NavDropdown
              label="Resources"
              active={isResourcesSection}
              open={resourcesOpen}
              onOpen={() => {
                setAboutOpen(false);
                setResourcesOpen(true);
              }}
              onClose={() => setResourcesOpen(false)}
              onToggle={() => {
                setAboutOpen(false);
                setResourcesOpen((open) => !open);
              }}
              links={resourceNavLinks}
              pathname={pathname}
              align="right"
            />

            <Link to="/contact" className={navLinkClass(isContactPage)}>
              Contact
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              to="/admin/login"
              className={`hidden rounded-lg border-2 border-ink px-3 py-2 text-[10px] font-black uppercase tracking-widest transition-colors sm:rounded-xl sm:border-4 sm:px-4 sm:py-2.5 lg:inline-flex xl:text-xs ${
                pathname.startsWith("/admin")
                  ? "bg-maroon text-white"
                  : "bg-white text-ink hover:bg-muted"
              }`}
            >
              Login
            </Link>

            <button
              type="button"
              onClick={() => navigate("/experience")}
              className="hidden items-center gap-1.5 rounded-lg border-2 border-ink bg-maroon px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white transition-colors hover:bg-maroon/90 sm:rounded-xl sm:border-4 sm:px-4 sm:py-2.5 lg:inline-flex xl:gap-2 xl:px-6 xl:py-3 xl:text-xs"
            >
              <span className="lg:inline xl:hidden">3D Tour</span>
              <span className="hidden xl:inline">Launch 3D Tour</span>
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="rounded-lg border-2 border-ink bg-gold p-2 transition-colors hover:bg-gold/90 active:scale-95 sm:rounded-xl sm:border-4 lg:hidden"
              aria-label="Open menu"
              aria-expanded={isOpen}
            >
              <HiOutlineMenu className="text-xl text-ink sm:text-2xl" />
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
              className="fixed inset-0 z-110 bg-black/60 backdrop-blur-sm lg:hidden"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-120 flex h-[100dvh] w-[min(92vw,20rem)] flex-col border-l-4 border-ink bg-cream pb-[env(safe-area-inset-bottom)] sm:w-[min(85vw,22rem)] lg:hidden"
            >
              <div className="flex shrink-0 items-center justify-between border-b-2 border-ink/10 px-4 py-3 sm:px-5 sm:py-4">
                <img src={logo} alt="ISKA Virtual Tour" className="h-7 sm:h-8" />
                <button
                  type="button"
                  onClick={closeMobile}
                  className="rounded-lg border-2 border-ink bg-white p-2 transition-colors hover:bg-muted sm:rounded-xl sm:border-4"
                  aria-label="Close menu"
                >
                  <HiOutlineX className="text-lg sm:text-xl" />
                </button>
              </div>

              <div className="flex flex-1 flex-col overflow-y-auto overscroll-contain px-4 py-4 sm:px-5 sm:py-5">
                <div className="flex flex-col gap-1 sm:gap-2">
                  {primaryNavLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      onClick={closeMobile}
                      className={`flex min-h-11 items-center gap-3 rounded-lg px-2 text-lg font-black uppercase tracking-tighter transition-colors sm:min-h-12 sm:text-xl ${
                        link.active
                          ? "bg-maroon/10 text-maroon"
                          : "text-ink hover:bg-muted hover:text-maroon"
                      }`}
                    >
{link.name}
                    </Link>
                  ))}

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setMobileAboutOpen((open) => !open)}
                      className={`flex min-h-11 w-full items-center gap-3 rounded-lg px-2 text-lg font-black uppercase tracking-tighter transition-colors sm:min-h-12 sm:text-xl ${
                        isAboutPupSection
                          ? "bg-maroon/10 text-maroon"
                          : "text-ink hover:bg-muted hover:text-maroon"
                      }`}
                    >
About PUPLQ
                      <HiChevronDown
                        className={`ml-auto h-5 w-5 shrink-0 transition-transform ${mobileAboutOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    <AnimatePresence>
                      {mobileAboutOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden pl-5 sm:pl-6"
                        >
                          <div className="mt-1 space-y-1 border-l-2 border-ink/15 py-1 pl-4">
                            {aboutNavLinks.map((link) => (
                              <Link
                                key={link.path}
                                to={link.path}
                                onClick={closeMobile}
                                className={`flex min-h-10 items-center text-sm font-black uppercase tracking-tight sm:text-base ${
                                  pathname === link.path
                                    ? "text-maroon"
                                    : "text-ink/70 hover:text-maroon"
                                }`}
                              >
                                {link.name}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => setMobileResourcesOpen((open) => !open)}
                      className={`flex min-h-11 w-full items-center gap-3 rounded-lg px-2 text-lg font-black uppercase tracking-tighter transition-colors sm:min-h-12 sm:text-xl ${
                        isResourcesSection
                          ? "bg-maroon/10 text-maroon"
                          : "text-ink hover:bg-muted hover:text-maroon"
                      }`}
                    >
Resources
                      <HiChevronDown
                        className={`ml-auto h-5 w-5 shrink-0 transition-transform ${mobileResourcesOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    <AnimatePresence>
                      {mobileResourcesOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden pl-5 sm:pl-6"
                        >
                          <div className="mt-1 space-y-1 border-l-2 border-ink/15 py-1 pl-4">
                            {resourceNavLinks.map((link) => (
                              <Link
                                key={link.path}
                                to={link.path}
                                onClick={closeMobile}
                                className={`flex min-h-10 items-center text-sm font-black uppercase tracking-tight sm:text-base ${
                                  pathname === link.path
                                    ? "text-maroon"
                                    : "text-ink/70 hover:text-maroon"
                                }`}
                              >
                                {link.name}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Link
                    to="/contact"
                    onClick={closeMobile}
                    className={`flex min-h-11 items-center gap-3 rounded-lg px-2 text-lg font-black uppercase tracking-tighter transition-colors sm:min-h-12 sm:text-xl ${
                      isContactPage
                        ? "bg-maroon/10 text-maroon"
                        : "text-ink hover:bg-muted hover:text-maroon"
                    }`}
                  >
Contact
                  </Link>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:mt-6">
                  <Link
                    to="/admin/login"
                    onClick={closeMobile}
                    className={`w-full rounded-xl border-4 border-ink py-3 text-center text-xs font-black uppercase tracking-widest transition-colors active:scale-[0.98] sm:py-3.5 sm:text-sm ${
                      pathname.startsWith("/admin")
                        ? "bg-maroon text-white"
                        : "bg-white text-ink hover:bg-muted"
                    }`}
                  >
                    Admin Login
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      closeMobile();
                      navigate("/experience");
                    }}
                    className="w-full rounded-xl border-4 border-ink bg-maroon py-3 text-center text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-maroon/90 active:scale-[0.98] sm:py-3.5 sm:text-sm"
                  >
                    Launch 3D Tour
                  </button>
                </div>
              </div>

              <div className="shrink-0 border-t-2 border-ink/10 px-4 py-3 sm:px-5 sm:py-4">
                <div className="rounded-xl border-2 border-ink bg-gold px-3 py-2.5 sm:rounded-2xl sm:border-4 sm:px-4 sm:py-3">
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
