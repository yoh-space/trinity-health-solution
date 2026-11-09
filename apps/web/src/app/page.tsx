import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { CommitmentsBar } from "@/components/marketing/CommitmentsBar";
import { ServicesSection } from "@/components/marketing/ServicesSection";
import { LearningTopicsSection } from "@/components/marketing/LearningTopicsSection";
import { OpalLiveTeaser } from "@/components/marketing/OpalLiveTeaser";
import { PantryExplorerSection } from "@/components/marketing/PantryExplorerSection";
import { ApproachSection } from "@/components/marketing/ApproachSection";
import { AudiencePathways } from "@/components/marketing/AudiencePathways";
import { PartnerSection } from "@/components/marketing/PartnerSection";
import { MobileAppShowcase } from "@/components/marketing/MobileAppShowcase";
import { CommunityCta } from "@/components/marketing/CommunityCta";
import { ContactSection } from "@/components/marketing/ContactSection";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingLanguageProvider } from "@/components/marketing/MarketingLanguageContext";
import { BackToTopButton } from "@/components/common/BackToTopButton";
import { FloatingOpalChat } from "@/components/chat/FloatingOpalChat";
import { FloatingTelegramButton } from "@/components/common/FloatingTelegramButton";

export default function Home() {
  return (
    <MarketingLanguageProvider>
      <div className="min-h-screen bg-[#fbfaf6] text-[#183b2d]">
        <MarketingHeader />
        <main className="overflow-x-clip">
          <MarketingHero />
          <CommitmentsBar />
          <ServicesSection />
          <LearningTopicsSection />
          <OpalLiveTeaser />
          <PantryExplorerSection />
          <ApproachSection />
          <AudiencePathways />
          <PartnerSection />
          <MobileAppShowcase />
          <CommunityCta />
          <ContactSection />
        </main>
        <MarketingFooter />
        <BackToTopButton />
        <FloatingTelegramButton />
        <FloatingOpalChat />
      </div>
    </MarketingLanguageProvider>
  );
}
