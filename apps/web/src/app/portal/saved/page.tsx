import Link from "next/link";
import { ArrowLeft, Bookmark, BookOpen, Clock } from "lucide-react";

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

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {savedItems.map((item) => (
            <div
              key={item.slug}
              className="rounded-2xl border border-[#dce6dc] bg-[#fbfdfb] p-5 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1c573e]">
                  {item.category}
                </span>
                <h3 className="mt-1 text-sm font-bold text-[#163826]">{item.title}</h3>
              </div>
              <div className="mt-4 pt-3 border-t border-[#edf2ec] flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-[#6b8271]">
                  <Clock size={12} /> {item.readMinutes} min read
                </span>
                <Link
                  href={`/learn/${item.slug}`}
                  className="font-bold text-[#1c573e] hover:underline"
                >
                  Read Note
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
