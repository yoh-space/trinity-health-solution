import { EducationArticle } from "@/components/education/EducationArticle";

export default async function EducationArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <EducationArticle slug={slug} />;
}
