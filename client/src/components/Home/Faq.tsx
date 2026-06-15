import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ContactFaq } from "../../features/contact/components/ContactFaq";
import {
  PUPLQ_FAQ_SECTIONS,
  TOUR_FAQ_SECTIONS,
} from "../../features/contact/constants";
import { PageHeader, Section } from "../marketing";
import {
  puplqFaqPageIntro,
  tourFaqPageIntro,
} from "./data/resourcesContent";

export type FaqVariant = "tour" | "puplq";

const faqConfig = {
  tour: {
    intro: tourFaqPageIntro,
    sections: TOUR_FAQ_SECTIONS,
    title: (
      <>
        Tour <span className="text-maroon">FAQ</span>
      </>
    ),
    other: {
      label: "PUPLQ FAQ",
      description: "Enrollment, campus visits, and registrar questions",
      path: "/resources/faq/puplq",
    },
  },
  puplq: {
    intro: puplqFaqPageIntro,
    sections: PUPLQ_FAQ_SECTIONS,
    title: (
      <>
        PUPLQ <span className="text-maroon">FAQ</span>
      </>
    ),
    other: {
      label: "Tour FAQ",
      description: "Controls, navigation, and virtual tour troubleshooting",
      path: "/resources/faq/tour",
    },
  },
} as const;

type FaqProps = {
  variant: FaqVariant;
};

export function Faq({ variant }: FaqProps) {
  const config = faqConfig[variant];

  return (
    <Section id="faq" dotGrid>
      <PageHeader title={config.title} description={config.intro.description} />
      <ContactFaq sections={config.sections} showHeader={false} />
      <aside className="mx-auto mt-10 max-w-3xl rounded-2xl border border-ink bg-cream p-5 shadow-brutal-sm sm:mt-12 sm:rounded-3xl sm:p-6">
        <p className="text-xs font-black uppercase tracking-widest text-maroon sm:text-sm">
          Looking for something else?
        </p>
        <p className="mt-2 text-sm font-bold leading-relaxed text-ink/70 sm:text-base">
          {config.other.description}
        </p>
        <Link
          to={config.other.path}
          className="mt-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide text-maroon transition-colors hover:text-ink sm:text-sm"
        >
          {config.other.label}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </aside>
    </Section>
  );
}
