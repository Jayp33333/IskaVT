import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { HiChevronDown } from "react-icons/hi2";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { aboutNavLinks } from "./data/pupLopezContent";
import { resourceNavLinks } from "./data/resourcesContent";

const navLinkBase =
  "relative shrink-0 whitespace-nowrap px-2 py-1.5 text-[11px] font-bold uppercase tracking-wide transition-colors after:absolute after:inset-x-1 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-maroon after:transition-transform after:duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon/40 focus-visible:ring-offset-1 focus-visible:ring-offset-cream sm:text-xs";

const navLinkActive = "text-maroon after:scale-x-100";
const navLinkInactive =
  "text-ink/75 hover:text-maroon hover:after:scale-x-100";

const btnPrimary =
  "inline-flex items-center justify-center gap-1.5 rounded-md border border-ink bg-maroon px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-maroon/90 sm:text-xs";

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
        className={`flex items-center gap-0.5 ${navLinkBase} ${
          active || open ? navLinkActive : navLinkInactive
        }`}
      >
        <span className="relative whitespace-nowrap">{label}</span>
        <HiChevronDown
          className={`h-3 w-3 shrink-0 opacity-70 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <div
            className={`absolute top-full z-50 pt-1.5 ${align === "right" ? "right-0" : "left-0"}`}
          >
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="scheme-light max-h-[min(70vh,20rem)] min-w-[11rem] overflow-y-auto rounded-lg border border-ink bg-white py-1 text-ink shadow-brutal-sm"
            >
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={onClose}
                  className={`block px-3 py-2 text-[11px] font-bold uppercase tracking-wide transition-colors sm:text-xs ${
                    pathname === link.path
                      ? "bg-maroon text-white"
                      : "text-ink/80 hover:bg-gold/40 hover:text-ink"
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
    `${navLinkBase} ${active ? navLinkActive : navLinkInactive}`;

  const mobileNavLinkClass = (active: boolean) =>
    `flex min-h-9 items-center rounded-md px-3 text-sm font-bold uppercase tracking-wide transition-colors ${
      active ? "text-maroon" : "text-ink/80 hover:text-maroon"
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
    <nav className="scheme-light fixed top-0 z-50 w-full border-b border-ink bg-cream/95 text-ink backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-3 sm:px-5 lg:px-6">
        <div className="flex h-12 items-center justify-between gap-3 sm:h-14">
          <button
            type="button"
            className="group shrink-0 cursor-pointer rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon/40"
            onClick={() => navigate("/home")}
            aria-label="Go to home"
          >
            <div className="relative">
              <img
                src={logo}
                alt="ISKA Virtual Tour"
                className="relative z-10 h-6 w-auto sm:h-7 lg:h-8"
              />
              <div className="absolute -inset-1.5 z-0 scale-0 rounded-full bg-gold/60 transition-transform duration-300 group-hover:scale-100" />
            </div>
          </button>

          <div className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex xl:gap-1">
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

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => navigate("/experience")}
              className={`${btnPrimary} hidden lg:inline-flex`}
            >
              Visit App
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center justify-center rounded-md p-2 text-ink transition-colors hover:text-maroon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon/40 active:scale-95 lg:hidden"
              aria-label="Open menu"
              aria-expanded={isOpen}
            >
              <HiOutlineMenu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                key="mobile-menu-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeMobile}
                aria-hidden
                className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-[2px] lg:hidden"
              />

              <motion.div
                key="mobile-menu-drawer"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 280 }}
                className="scheme-light fixed inset-y-0 right-0 z-[210] flex h-[100dvh] w-[min(88vw,18rem)] flex-col bg-white text-ink pb-[env(safe-area-inset-bottom)] lg:hidden"
              >
              <div className="flex shrink-0 items-center justify-between px-4 py-3">
                <img src={logo} alt="ISKA Virtual Tour" className="h-6" />
                <button
                  type="button"
                  onClick={closeMobile}
                  className="rounded-md p-2 text-ink transition-colors hover:text-maroon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon/40"
                  aria-label="Close menu"
                >
                  <HiOutlineX className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-1 flex-col overflow-y-auto overscroll-contain px-3 py-3">
                <div className="flex flex-col gap-0.5">
                  {primaryNavLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      onClick={closeMobile}
                      className={mobileNavLinkClass(link.active)}
                    >
                      {link.name}
                    </Link>
                  ))}

                  <div className="pt-0.5">
                    <button
                      type="button"
                      onClick={() => setMobileAboutOpen((open) => !open)}
                      className={`${mobileNavLinkClass(isAboutPupSection)} w-full`}
                    >
                      About PUPLQ
                      <HiChevronDown
                        className={`ml-auto h-4 w-4 shrink-0 opacity-70 transition-transform ${mobileAboutOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    <AnimatePresence>
                      {mobileAboutOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden pl-3"
                        >
                          <div className="mt-0.5 space-y-0.5 border-l border-ink/15 py-1 pl-3">
                            {aboutNavLinks.map((link) => (
                              <Link
                                key={link.path}
                                to={link.path}
                                onClick={closeMobile}
                                className={`flex min-h-8 items-center text-xs font-semibold uppercase tracking-wide ${
                                  pathname === link.path
                                    ? "text-maroon"
                                    : "text-ink/65 hover:text-maroon"
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
                      className={`${mobileNavLinkClass(isResourcesSection)} w-full`}
                    >
                      Resources
                      <HiChevronDown
                        className={`ml-auto h-4 w-4 shrink-0 opacity-70 transition-transform ${mobileResourcesOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    <AnimatePresence>
                      {mobileResourcesOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden pl-3"
                        >
                          <div className="mt-0.5 space-y-0.5 border-l border-ink/15 py-1 pl-3">
                            {resourceNavLinks.map((link) => (
                              <Link
                                key={link.path}
                                to={link.path}
                                onClick={closeMobile}
                                className={`flex min-h-8 items-center text-xs font-semibold uppercase tracking-wide ${
                                  pathname === link.path
                                    ? "text-maroon"
                                    : "text-ink/65 hover:text-maroon"
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
                    className={mobileNavLinkClass(isContactPage)}
                  >
                    Contact
                  </Link>
                </div>

                <div className="mt-4 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      closeMobile();
                      navigate("/experience");
                    }}
                    className={`${btnPrimary} w-full`}
                  >
                    Visit App
                  </button>
                </div>
              </div>

              <div className="shrink-0 px-3 py-3">
                <p className="text-center text-[10px] font-bold uppercase tracking-widest text-ink/50">
                  PUP Lopez Campus v2.0
                </p>
              </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </nav>
  );
};
