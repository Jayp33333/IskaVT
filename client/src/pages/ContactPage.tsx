import { ContactSection } from "../features/contact";
import { MarketingLayout } from "../components/marketing";

export default function ContactPage() {
  return (
    <MarketingLayout>
      <ContactSection showPageHeader showExtendedContent />
    </MarketingLayout>
  );
}
