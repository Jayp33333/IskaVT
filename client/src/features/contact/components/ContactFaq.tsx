import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ExternalLink } from "lucide-react";
import {
  type ContactFaqItem,
  type ContactFaqSection,
  type ContactFaqStep,
  type ContactFaqSubItem,
} from "../constants";
import { useFaqSpeech } from "../hooks/useFaqSpeech";
import { getFaqSpeechText } from "../utils/faqSpeechText";

type ContactFaqProps = {
  sections: ContactFaqSection[];
  showHeader?: boolean;
  subtitle?: string;
};

function FaqSteps({ steps }: { steps: ContactFaqStep[] }) {
  return (
    <ol className="mt-4 space-y-4">
      {steps.map((step, stepIndex) => (
        <li
          key={step.title}
          className="overflow-hidden rounded-xl border border-ink bg-white sm:rounded-2xl"
        >
          <div className="flex gap-3 border-b border-ink/10 bg-cream px-4 py-3 sm:px-5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-ink bg-maroon text-xs font-black text-white sm:h-8 sm:w-8 sm:text-sm">
              {stepIndex + 1}
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="text-sm font-black uppercase tracking-tight text-ink sm:text-base">
                {step.title}
              </p>
              {step.description && (
                <p className="mt-1 text-xs font-bold leading-relaxed text-ink/65 sm:text-sm">
                  {step.description}
                </p>
              )}
              {step.link && (
                <a
                  href={step.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wide text-maroon transition-colors hover:text-ink sm:text-sm"
                >
                  {step.link.label}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>

          {step.image && (
            <div className="bg-muted/40 p-3 sm:p-4">
              <img
                src={step.image}
                alt={step.imageAlt ?? `Step ${stepIndex + 1}`}
                className="w-full rounded-lg border border-ink object-contain sm:rounded-xl"
                loading="lazy"
              />
            </div>
          )}

          {step.requirements && step.requirements.length > 0 && (
            <div className="border-t border-ink/10 bg-white px-4 py-4 sm:px-5">
              <p className="mb-3 text-xs font-black uppercase tracking-widest text-maroon sm:text-sm">
                Requirements
              </p>
              <ul className="space-y-2">
                {step.requirements.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-xs font-bold text-ink/75 sm:text-sm"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-maroon" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {step.images && step.images.length > 0 && (
            <div className="space-y-3 bg-muted/40 p-3 sm:p-4">
              {step.exampleLabel && (
                <p className="text-xs font-black uppercase tracking-widest text-ink/55 sm:text-sm">
                  {step.exampleLabel}
                </p>
              )}
              {step.images.map((img, imgIndex) => (
                <img
                  key={`${img.src}-${imgIndex}`}
                  src={img.src}
                  alt={img.alt ?? `Step ${stepIndex + 1} — image ${imgIndex + 1}`}
                  className="w-full rounded-lg border border-ink object-contain sm:rounded-xl"
                  loading="lazy"
                />
              ))}
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}

function FaqAccordion({
  item,
  index,
  nested = false,
  speechId,
  speak,
  stop,
  speakingIdRef,
  isSupported,
}: {
  item: ContactFaqItem | ContactFaqSubItem;
  index: number;
  nested?: boolean;
  speechId: string;
  speak: (id: string, text: string) => void;
  stop: () => void;
  speakingIdRef: React.RefObject<string | null>;
  isSupported: boolean;
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const hasSubItems = "subItems" in item && item.subItems?.length;
  const hasSteps = "steps" in item && item.steps?.length;
  const hasRequirements =
    "requirements" in item &&
    item.requirements?.length &&
    !hasSteps;

  useEffect(() => {
    const details = detailsRef.current;
    if (!details || !isSupported) {
      return;
    }

    const handleToggle = () => {
      if (details.open) {
        speak(speechId, getFaqSpeechText(item));
        return;
      }

      const currentSpeakingId = speakingIdRef.current;
      if (
        currentSpeakingId === speechId ||
        currentSpeakingId?.startsWith(`${speechId}/`)
      ) {
        stop();
      }
    };

    details.addEventListener("toggle", handleToggle);
    return () => details.removeEventListener("toggle", handleToggle);
  }, [item, speechId, speak, stop, speakingIdRef, isSupported]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
    >
      <details
        ref={detailsRef}
        className={`group rounded-2xl border border-ink bg-white shadow-brutal-md open:shadow-brutal-maroon sm:rounded-3xl ${
          nested ? "border-ink/15 bg-cream shadow-none open:shadow-none" : ""
        }`}
      >
      <summary className="cursor-pointer list-none px-5 py-4 marker:content-none sm:px-6 sm:py-5 [&::-webkit-details-marker]:hidden">
        <span className="flex items-center justify-between gap-4">
          <span
            className={`text-left font-black uppercase tracking-tighter text-ink ${
              nested
                ? "text-xs sm:text-sm"
                : "text-sm sm:text-base"
            }`}
          >
            {item.question}
          </span>
          <ChevronDown
            className="h-5 w-5 shrink-0 text-maroon transition-transform duration-200 group-open:rotate-180"
            aria-hidden
          />
        </span>
      </summary>
      <div className="px-5 pb-5 pt-1 sm:px-6 sm:pb-6">
        {item.answer && (
          <p className="text-sm font-bold leading-relaxed text-ink/70 sm:text-base">
            {item.answer}
          </p>
        )}

        {hasSteps && <FaqSteps steps={item.steps!} />}

        {hasRequirements && (
          <div className="mt-4 rounded-xl border border-ink/15 bg-cream px-4 py-4 sm:px-5 sm:py-5">
            {"requirementsHeading" in item && item.requirementsHeading && (
              <p className="mb-4 text-xs font-black uppercase tracking-widest text-maroon sm:text-sm">
                {item.requirementsHeading}
              </p>
            )}
            <ol className="space-y-3">
              {item.requirements!.map((requirement, reqIndex) => (
                <li
                  key={requirement}
                  className="flex items-start gap-3 text-xs font-bold leading-relaxed text-ink/75 sm:text-sm"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-ink bg-maroon text-[10px] font-black text-white sm:h-7 sm:w-7 sm:text-xs">
                    {reqIndex + 1}
                  </span>
                  <span className="pt-0.5">{requirement}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {hasSubItems && (
          <div className="mt-4 space-y-3 border-l-2 border-maroon/30 pl-4 sm:pl-5">
            {item.subItems!.map((subItem, subIndex) => (
              <FaqAccordion
                key={subItem.question}
                item={subItem}
                index={subIndex}
                nested
                speechId={`${speechId}/${subItem.question}`}
                speak={speak}
                stop={stop}
                speakingIdRef={speakingIdRef}
                isSupported={isSupported}
              />
            ))}
          </div>
        )}
      </div>
      </details>
    </motion.div>
  );
}

export function ContactFaq({
  sections,
  showHeader = true,
  subtitle,
}: ContactFaqProps) {
  const { speak, stop, speakingIdRef, isSupported } = useFaqSpeech();
  const showSectionTitles = sections.length > 1;
  let itemIndex = 0;

  return (
    <section className={showHeader ? "mt-12 sm:mt-16" : undefined}>
      {showHeader && subtitle && (
        <div className="mb-8 flex flex-col items-center text-center sm:mb-10">
          <h2 className="text-2xl font-black uppercase leading-tight tracking-tighter text-ink sm:text-3xl md:text-4xl">
            Frequently Asked <span className="text-maroon">Questions</span>
          </h2>
          <p className="mt-3 max-w-xl text-sm font-bold text-ink/60 sm:text-base">
            {subtitle}
          </p>
        </div>
      )}

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 sm:gap-10">
        {sections.map((section) => (
          <div key={section.title} className="flex flex-col gap-4 sm:gap-5">
            {showSectionTitles && (
              <h3 className="text-xs font-black uppercase tracking-widest text-maroon sm:text-sm">
                {section.title}
              </h3>
            )}
            {section.items.map((item) => {
              const index = itemIndex++;
              return (
                <FaqAccordion
                  key={item.question}
                  item={item}
                  index={index}
                  speechId={item.question}
                  speak={speak}
                  stop={stop}
                  speakingIdRef={speakingIdRef}
                  isSupported={isSupported}
                />
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
