import { ArrowUpRight, Heart, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionDotGrid } from "../marketing/SectionDotGrid";
import { aboutNavLinks } from "./data/pupLopezContent";
import { resourceNavLinks } from "./data/resourcesContent";
import {
  CAMPUS_MAP_LINK_URL,
  PUP_LOPEZ_OFFICIAL_EMAIL,
} from "../../features/contact/constants";

const exploreLinks = [
  { name: "Home", path: "/home" },
  { name: "Features", path: "/features" },
  { name: "Programs", path: "/programs" },
  { name: "Virtual Tour", path: "/experience" },
  { name: "Contact", path: "/contact" },
];

const aboutLinks = aboutNavLinks.slice(0, 5);

export function Footer() {
  const navigateToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative overflow-hidden border-t border-ink bg-white px-4 pb-8 pt-16 text-ink sm:px-6 sm:pb-10 sm:pt-20 lg:px-12 lg:pb-12 lg:pt-24 xl:px-20">
      <SectionDotGrid tone="light" />

      <div className="pointer-events-none absolute -right-16 top-8 h-40 w-40 rounded-full bg-maroon/10 blur-[100px] sm:h-56 sm:w-56" />
      <div className="pointer-events-none absolute bottom-24 left-0 h-32 w-32 rounded-full bg-gold/20 blur-[80px]" />

      <div className="container relative mx-auto">
        <div className="mb-10 flex flex-col gap-10 sm:mb-12 sm:gap-12 lg:mb-16 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div className="space-y-5 sm:space-y-6 lg:max-w-sm">
            <div className="flex flex-col items-start gap-3 sm:gap-4">
              <img
                src="/images/iska-logo.png"
                alt="ISKA Virtual Tour"
                className="h-8 sm:h-9 lg:h-10"
              />
              <span className="rotate-2 rounded-md border border-ink bg-gold px-2.5 py-0.5 text-[10px] font-black uppercase tracking-tighter text-ink shadow-brutal-sm sm:px-3 sm:py-1 sm:text-xs">
                3D VIRTUAL TOUR
              </span>
            </div>

            <div className="space-y-4">
              <a
                href={`mailto:${PUP_LOPEZ_OFFICIAL_EMAIL}`}
                className="group flex items-center gap-3 transition-colors hover:text-maroon"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-ink bg-gold/30 text-ink shadow-brutal-sm">
                  <Mail className="h-4 w-4" />
                </span>
                <span className="text-sm font-bold group-hover:text-maroon sm:text-base">
                  {PUP_LOPEZ_OFFICIAL_EMAIL}
                </span>
              </a>

              <a
                href={CAMPUS_MAP_LINK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 transition-colors hover:text-maroon"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-ink bg-gold/30 text-ink shadow-brutal-sm">
                  <MapPin className="h-4 w-4" />
                </span>
                <span className="text-sm font-bold leading-snug group-hover:text-maroon sm:text-base">
                  Yumul St., Brgy. Burgos, Lopez, Quezon 4316
                </span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-10 lg:gap-12">
            <FooterLinkColumn title="Explore" links={exploreLinks} />
            <FooterLinkColumn title="About PUP Lopez" links={aboutLinks} />
            <FooterLinkColumn
              title="Resources"
              links={resourceNavLinks}
              className="col-span-2 sm:col-span-1"
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-5 border-t border-ink/15 pt-8 sm:gap-6 sm:pt-10 md:flex-row">
          <p className="flex items-center gap-2 text-xs font-bold text-ink/60 sm:text-sm">
            © 2026 Made with{" "}
            <Heart className="h-3.5 w-3.5 fill-maroon text-maroon sm:h-4 sm:w-4" />{" "}
            by DIT Student
          </p>

          <button
            type="button"
            onClick={navigateToTop}
            className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-maroon sm:text-xs"
          >
            Back to top
            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-ink bg-gold shadow-brutal-sm transition-transform group-hover:-translate-y-1 sm:h-8 sm:w-8">
              <ArrowUpRight className="h-3.5 w-3.5 rotate-[-45deg] text-ink sm:h-4 sm:w-4" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}

type FooterLinkColumnProps = {
  title: string;
  links: { name: string; path: string }[];
  className?: string;
};

function FooterLinkColumn({ title, links, className }: FooterLinkColumnProps) {
  return (
    <div className={className}>
      <h3 className="mb-3 text-[10px] font-black uppercase tracking-widest text-ink/50 sm:mb-4 sm:text-xs">
        {title}
      </h3>
      <ul className="space-y-2 sm:space-y-2.5">
        {links.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className="text-sm font-bold text-ink/75 transition-colors hover:text-maroon sm:text-base"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
