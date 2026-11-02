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
import { BackToTopButton } from "@/components/common/BackToTopButton";

export default function Home() {
  return (
    <MarketingLanguageProvider>
      <div className="min-h-screen bg-[#fbfaf6] text-[#183b2d]">
        <MarketingHeader />
        <main className="overflow-x-clip">
          <MarketingHero />
          <CommitmentsBar />
          <LearningTopicsSection />
          <OpalLiveTeaser />
          <PantryExplorerSection />
          <ApproachSection />
          <AudiencePathways />
          <MobileAppShowcase />
          <CommunityCta />
        </main>
        <MarketingFooter />
        <BackToTopButton />
      </div>
    </MarketingLanguageProvider>
  );
}
