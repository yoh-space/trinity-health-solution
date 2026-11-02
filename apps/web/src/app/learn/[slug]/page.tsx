import { EducationArticle } from "@/components/education/EducationArticle";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingLanguageProvider } from "@/components/marketing/MarketingLanguageContext";

export default async function EducationArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <MarketingLanguageProvider>
      <div className="min-h-screen bg-[#fbfaf6] text-[#183b2d]">
        <MarketingHeader />
        <EducationArticle slug={slug} />
        <MarketingFooter />
      </div>
    </MarketingLanguageProvider>
  );
}
