import { appConfig } from "@/app-config";
import { ComingSoon } from "@/app/(main)/(coming-soon)/coming-soon";
import { HeroSection } from "./_sections/hero";
import PricingSection from "./_sections/pricing";

export default function Home() {
  if (appConfig.mode === "comingSoon") {
    return <ComingSoon />;
  }

  return (
    <div>
      <HeroSection />
      <PricingSection />
    </div>
  );
}
