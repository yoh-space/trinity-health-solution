import Link from "next/link";
import { ArrowLeft, Bookmark } from "lucide-react";

export const metadata = {
  title: "Saved Guides | Client Portal | Trinity Health Solution",
};

export default function PortalSavedPage() {
  const savedItems = [
    {
      title: "Safe Food Preparation in Ethiopian Kitchens",
      category: "Food Safety",
      readMinutes: 3,
      slug: "food-safety-kitchen",
    },
    {
      title: "Nutritious Eating During Pregnancy and Breastfeeding",
      category: "Maternal Nutrition",
      readMinutes: 4,
      slug: "maternal-nutrition-pregnancy",
    },
  ];

  return (
    <div className="max-w-3xl space-y-6">
      <Link
        href="/portal"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1c573e] hover:underline"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        <span>Back to Portal Overview</span>
      </Link>

      <div className="rounded-3xl border border-[#dce8de] bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center border-b border-[#e2eae1] pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1c573e]">
                BOOKMARKED CURRICULUM
              </span>
              <span className="text-[#cbd6cc]">•</span>
              <span className="text-xs text-[#6e8574]">Personal Reading</span>
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#163826]">
              Saved Learning Notes
            </h1>
          </div>
          <Link
            href="/learn"
            className="rounded-full bg-[#1c573e] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#154631] transition"
          >
            Browse Library
          </Link>
        </div>

        <div className="mt-6 rounded-2xl border border-dashed border-[#ccd9cc] p-8 text-center">
          <Bookmark size={28} className="mx-auto text-[#799080]" />
          <p className="mt-3 text-sm text-[#657a6b]">No saved learning notes yet.</p>
          <Link href="/learn" className="mt-3 inline-block text-xs font-bold text-[#1c573e] hover:underline">
            Browse the learning library
          </Link>
        </div>
      </div>
    </div>
  );
}
