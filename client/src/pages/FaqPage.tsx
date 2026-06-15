import { Navigate, useParams } from "react-router-dom";
import { Faq, type FaqVariant } from "../components/Home/Faq";
import { MarketingLayout } from "../components/marketing";

function isFaqVariant(value: string | undefined): value is FaqVariant {
  return value === "tour" || value === "puplq";
}

export default function FaqPage() {
  const { variant } = useParams<{ variant: string }>();

  if (!isFaqVariant(variant)) {
    return <Navigate to="/resources/faq/puplq" replace />;
  }

  return (
    <MarketingLayout>
      <Faq variant={variant} />
    </MarketingLayout>
  );
}
