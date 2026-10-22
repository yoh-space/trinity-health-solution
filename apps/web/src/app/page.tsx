import { ApproachSection } from "@/components/marketing/ApproachSection";
import { CommunityCta } from "@/components/marketing/CommunityCta";
import { CommitmentsBar } from "@/components/marketing/CommitmentsBar";
import { LearningTopicsSection } from "@/components/marketing/LearningTopicsSection";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { MarketingHero } from "@/components/marketing/MarketingHero";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfaf6] text-[#183b2d]">
      <MarketingHeader />
      <MarketingHero />
      <CommitmentsBar />
      <LearningTopicsSection />
      <ApproachSection />
      <CommunityCta />
      <MarketingFooter />
    </main>
  );
}
