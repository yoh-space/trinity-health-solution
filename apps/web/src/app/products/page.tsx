import type { Metadata } from "next";
import { ProductsPageContent } from "./ProductsPageContent";

export const metadata: Metadata = {
  title: "Maternal & Infant Wellness Essentials | Trinity Health Solution (ምርቶች)",
  description:
    "Natural lactation support teas, fortified infant complementary weaning blends, household clean water kits, and community learning tools for Ethiopian mothers and families.",
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "Maternal & Infant Wellness Essentials | Trinity Health Solution",
    description:
      "Culturally rooted, evidence-grounded nutrition and safety essentials for Ethiopian mothers and children.",
    url: "https://trinity-health-solution.vercel.app/products",
  },
};

export default function ProductsPage() {
  return <ProductsPageContent />;
}
