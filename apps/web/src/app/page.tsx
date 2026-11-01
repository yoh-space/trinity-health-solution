import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { CommitmentsBar } from "@/components/marketing/CommitmentsBar";
import { LearningTopicsSection } from "@/components/marketing/LearningTopicsSection";
import { OpalLiveTeaser } from "@/components/marketing/OpalLiveTeaser";
import { PantryExplorerSection } from "@/components/marketing/PantryExplorerSection";
import { ApproachSection } from "@/components/marketing/ApproachSection";
import { AudiencePathways } from "@/components/marketing/AudiencePathways";
import { MobileAppShowcase } from "@/components/marketing/MobileAppShowcase";
import { CommunityCta } from "@/components/marketing/CommunityCta";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingLanguageProvider } from "@/components/marketing/MarketingLanguageContext";

export default function Home() {
  return (
    <MarketingLanguageProvider>
      <main className="min-h-screen overflow-hidden bg-[#fbfaf6] text-[#183b2d]">
        <MarketingHeader />
        <MarketingHero />
        <CommitmentsBar />
        <LearningTopicsSection />
        <OpalLiveTeaser />
        <PantryExplorerSection />
        <ApproachSection />
        <AudiencePathways />
        <MobileAppShowcase />
        <CommunityCta />
        <MarketingFooter />
      </main>
    </MarketingLanguageProvider>
  );
}
