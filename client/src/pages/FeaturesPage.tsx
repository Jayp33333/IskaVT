import { Features } from "../components/Home/Features";
import { MarketingLayout } from "../components/marketing";

export default function FeaturesPage() {
  return (
    <MarketingLayout>
      <Features showExtendedContent />
    </MarketingLayout>
  );
}
