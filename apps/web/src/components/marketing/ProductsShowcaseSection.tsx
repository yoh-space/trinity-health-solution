"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import {
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  PhoneCall,
} from "lucide-react";
import { useMarketingLanguage } from "./MarketingLanguageContext";

export function ProductsShowcaseSection() {
  const { language, t } = useMarketingLanguage();
  const liveProducts = useQuery(anyApi.products.listPublished);

  // Take top 3 featured products configured by admin
  const featured = liveProducts && liveProducts.length > 0 ? liveProducts.slice(0, 3) : null;

  return (
    <section className="bg-[#f7faf6] py-20 sm:py-24 border-t border-[#e6efe4]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#dde8db]">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-[#163826] sm:text-4xl">
              {t("Community Health Essentials & Nutrition Solutions", "ለእናቶችና ህፃናት ጤና አስፈላጊ የተመጣጠኑ ምርቶች")}
            </h2>
            <p className="mt-3 text-sm text-[#5a7261] leading-relaxed">
              {t(
                "Lactation blends, mineral-rich maternal porridges, safe water tablets, and visual learning tools for Ethiopian mothers.",
                "የተፈጥሮ የጡት ወተት ማሳደጊያዎች፣ አልሚ የእናቶች እህሎች፣ የውሃ ማጣሪያዎች እና ምስላዊ መማሪያዎች።"
              )}
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full bg-[#1c573e] px-6 py-3 text-xs font-bold text-white shadow-xs hover:bg-[#154631] transition shrink-0 active:scale-95"
          >
            <span>{t("View All Products", "ሁሉንም ምርቶች ይመልከቱ")}</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Real-time Products Cards Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured ? (
            featured.map((product: any) => {
              const inStock = product.inStock !== false;
              return (
                <div
                  key={product._id}
                  className="group relative flex flex-col justify-between rounded-3xl border border-[#dce6dc] bg-white p-6 shadow-xs hover:border-[#1c573e]/40 hover:shadow-md transition duration-200"
                >
                  <div>
                    {/* Image / Thumbnail */}
                    {product.imageUrl ? (
                      <div className="relative mb-5 h-48 w-full overflow-hidden rounded-2xl bg-[#f4f7f4]">
                        <img
                          src={product.imageUrl}
                          alt={language === "am" ? product.titleAm : product.titleEn}
                          className="size-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      </div>
                    ) : (
                      <div className="relative mb-5 flex h-36 w-full items-center justify-center rounded-2xl bg-[#eaf4ec] text-[#1c573e]">
                        <ShoppingBag size={36} className="text-[#1c573e]/40" />
                      </div>
                    )}

                    {/* Badge & Stock */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="inline-block rounded-full bg-[#eef6f0] px-3 py-1 text-[11px] font-bold text-[#1c573e]">
                        {language === "am" ? product.badgeAm : product.badgeEn}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider ${
                          inStock ? "text-emerald-700" : "text-amber-700"
                        }`}
                      >
                        {inStock
                          ? language === "am"
                            ? "በክምችት አለ"
                            : "In Stock"
                          : language === "am"
                          ? "ለጊዜው አልቋል"
                          : "Temporarily Out of Stock"}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-[#163826] leading-snug">
                      {language === "am" ? product.titleAm : product.titleEn}
                    </h3>
                    <p className="text-xs text-[#637d6b] font-medium mt-0.5">
                      {language === "am" ? product.subtitleAm : product.subtitleEn}
                    </p>

                    {/* Description */}
                    <p className="mt-3 text-xs leading-relaxed text-[#516757] line-clamp-3">
                      {language === "am" ? product.descriptionAm : product.descriptionEn}
                    </p>

                    {/* Highlights bullet list */}
                    {product.highlightsEn && product.highlightsEn.length > 0 && (
                      <ul className="mt-4 space-y-1.5 border-t border-[#eef4ed] pt-3 text-[11px] text-[#425949]">
                        {(language === "am" ? product.highlightsAm : product.highlightsEn)
                          ?.slice(0, 2)
                          .map((h: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <CheckCircle2 size={13} className="text-[#1c573e] shrink-0 mt-0.5" />
                              <span>{h}</span>
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-4 border-t border-[#edf3ec] flex items-center justify-between gap-3">
                    <a
                      href={product.telegramLink || "https://t.me/Trinity_health_solution"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#229ED9] px-4 py-2 text-xs font-bold text-white hover:bg-[#1c8ec4] transition"
                    >
                      <span>{t("Inquire on Telegram", "በቴሌግራም ይዘዙ")}</span>
                    </a>

                    <Link
                      href="/products"
                      className="text-xs font-bold text-[#1c573e] hover:underline"
                    >
                      {t("Details →", "ዝርዝር →")}
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            // Skeleton while loading
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-72 rounded-3xl border border-[#dce6dc] bg-white p-6 animate-pulse"
              >
                <div className="h-28 rounded-2xl bg-[#eef4ed] mb-4" />
                <div className="h-4 w-24 bg-[#eef4ed] rounded mb-2" />
                <div className="h-5 w-48 bg-[#eef4ed] rounded mb-3" />
                <div className="h-3 w-full bg-[#eef4ed] rounded mb-1" />
                <div className="h-3 w-3/4 bg-[#eef4ed] rounded" />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
