import { Hero } from "../components/Home/Hero";
import { HomeWelcome } from "../components/Home/HomeWelcome";
import { HomeHowItWorks } from "../components/Home/HomeHowItWorks";
import { HomeExplore } from "../components/Home/HomeExplore";
import { HomeAudience } from "../components/Home/HomeAudience";
import { HomeCta } from "../components/Home/HomeCta";
import { MarketingLayout } from "../components/marketing";

export default function HomePage() {
  return (
    <MarketingLayout hero>
      <Hero />
      <HomeWelcome />
      <HomeHowItWorks />
      <HomeExplore />
      <HomeAudience />
      <HomeCta />
    </MarketingLayout>
  );
}
