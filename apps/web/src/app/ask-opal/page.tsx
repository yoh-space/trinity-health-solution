import { OpalChat } from "@/components/education/OpalChat";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingLanguageProvider } from "@/components/marketing/MarketingLanguageContext";
import { BackToTopButton } from "@/components/common/BackToTopButton";

export const metadata = {
  title: "Ask Opal Health Guidance | Trinity Health Solution",
  description: "Evidence-backed family health guidance grounded in verified Trinity curriculum.",
};

export default function AskOpalPage() {
  return (
    <MarketingLanguageProvider>
      <div className="min-h-screen bg-[#fbfaf6] text-[#183b2d]">
        <MarketingHeader />
        <main>
          <OpalChat />
        </main>
        <MarketingFooter />
        <BackToTopButton />
      </div>
    </MarketingLanguageProvider>
  );
}
