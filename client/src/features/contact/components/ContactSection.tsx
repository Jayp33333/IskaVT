import { useContactForm } from "../hooks/useContactForm";
import { PageHeader, Section } from "../../../components/marketing";
import { CONTACT_PAGE_INTRO } from "../constants";
import { ContactForm } from "./ContactForm";
import { ContactInfoPanel } from "./ContactInfoPanel";
import { ContactLocation } from "./ContactLocation";

type ContactSectionProps = {
  showPageHeader?: boolean;
  showExtendedContent?: boolean;
};

export function ContactSection({
  showPageHeader = false,
  showExtendedContent = false,
}: ContactSectionProps) {
  const form = useContactForm();

  return (
    <Section id="contact" dotGrid>
      {showPageHeader && (
        <PageHeader
          title={
            <>
              Contact <span className="text-maroon">Us</span>
            </>
          }
          description={CONTACT_PAGE_INTRO.description}
        />
      )}

      <div className="flex flex-col gap-8 lg:flex-row lg:gap-10 xl:gap-12">
        <ContactInfoPanel />
        <ContactForm {...form} />
      </div>

      {showExtendedContent && <ContactLocation />}
    </Section>
  );
}
