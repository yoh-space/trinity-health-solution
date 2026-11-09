import { EducationLibrary } from "@/components/education/EducationLibrary";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingLanguageProvider } from "@/components/marketing/MarketingLanguageContext";
import { BackToTopButton } from "@/components/common/BackToTopButton";
import { FloatingOpalChat } from "@/components/chat/FloatingOpalChat";
import { FloatingTelegramButton } from "@/components/common/FloatingTelegramButton";

export const metadata = {
  title: "Health Education Library | Trinity Health Solution",
  description: "Curated bilingual health guides on nutrition, food hygiene, and family wellbeing.",
};

export default function LearnPage() {
  return (
    <MarketingLanguageProvider>
      <div className="min-h-screen bg-[#fbfaf6] text-[#183b2d]">
        <MarketingHeader />
        <main>
          <EducationLibrary />
        </main>
        <MarketingFooter />
        <BackToTopButton />
        <FloatingTelegramButton />
        <FloatingOpalChat />
      </div>
    </MarketingLanguageProvider>
  );
}
