import { ContactFaq } from "../../features/contact/components/ContactFaq";
import { PageHeader, Section } from "../marketing";
import { faqPageIntro } from "./data/resourcesContent";

export function Faq() {
  return (
    <Section id="faq" dotGrid>
      <PageHeader
        title={
          <>
            Frequently Asked <span className="text-maroon">Questions</span>
          </>
        }
        description={faqPageIntro.description}
      />
      <ContactFaq showHeader={false} />
    </Section>
  );
}
