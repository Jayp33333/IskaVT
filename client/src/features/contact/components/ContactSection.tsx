import { useContactForm } from "../hooks/useContactForm";
import { ContactForm } from "./ContactForm";
import { ContactInfoPanel } from "./ContactInfoPanel";

export function ContactSection() {
  const form = useContactForm();

  return (
    <section
      className="relative overflow-hidden bg-[#FFFDF5] px-4 py-16 sm:px-6 sm:py-20 lg:px-12 lg:py-24 xl:px-20"
      id="contact"
    >
      <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-[#800000]/5 blur-[100px] sm:h-80 sm:w-80" />

      <div className="container mx-auto">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10 xl:gap-12">
          <ContactInfoPanel />
          <ContactForm {...form} />
        </div>
      </div>
    </section>
  );
}
