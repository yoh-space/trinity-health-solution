export type ServiceStatus = "draft" | "published";

export interface ServiceItem {
  _id: string;
  slug: string;
  order: number;
  badgeEn: string;
  badgeAm: string;
  categoryEn: string;
  categoryAm: string;
  taglineEn: string;
  taglineAm: string;
  deliverablesEn: string[];
  deliverablesAm: string[];
  guidelineEn: string;
  guidelineAm: string;
  icon: string;
  accent: string;
  primaryCtaLabelEn: string;
  primaryCtaLabelAm: string;
  primaryCtaHref: string;
  status: ServiceStatus;
  publishedAt?: number;
  updatedAt?: number;
}

export type ServiceForm = {
  slug: string;
  order: number;
  badgeEn: string;
  badgeAm: string;
  categoryEn: string;
  categoryAm: string;
  taglineEn: string;
  taglineAm: string;
  deliverablesEn: string[];
  deliverablesAm: string[];
  guidelineEn: string;
  guidelineAm: string;
  icon: string;
  accent: string;
  primaryCtaLabelEn: string;
  primaryCtaLabelAm: string;
  primaryCtaHref: string;
};

export const emptyServiceForm: ServiceForm = {
  slug: "",
  order: 1,
  badgeEn: "Clinical Pillar",
  badgeAm: "ክሊኒካል ምሰሶ",
  categoryEn: "",
  categoryAm: "",
  taglineEn: "",
  taglineAm: "",
  deliverablesEn: [""],
  deliverablesAm: [""],
  guidelineEn: "",
  guidelineAm: "",
  icon: "Stethoscope",
  accent: "bg-[#eef6f0] text-[#1c573e] border-[#d8e7dc]",
  primaryCtaLabelEn: "Schedule Consultation",
  primaryCtaLabelAm: "ቀጠሮ ይያዙ",
  primaryCtaHref: "/portal/consultations/new",
};

export function formFromService(item: ServiceItem): ServiceForm {
  return {
    slug: item.slug,
    order: item.order,
    badgeEn: item.badgeEn,
    badgeAm: item.badgeAm,
    categoryEn: item.categoryEn,
    categoryAm: item.categoryAm,
    taglineEn: item.taglineEn,
    taglineAm: item.taglineAm,
    deliverablesEn: item.deliverablesEn.length > 0 ? [...item.deliverablesEn] : [""],
    deliverablesAm: item.deliverablesAm.length > 0 ? [...item.deliverablesAm] : [""],
    guidelineEn: item.guidelineEn,
    guidelineAm: item.guidelineAm,
    icon: item.icon === "Sparkles" ? "MessageCircle" : item.icon,
    accent: item.accent,
    primaryCtaLabelEn: item.primaryCtaLabelEn,
    primaryCtaLabelAm: item.primaryCtaLabelAm,
    primaryCtaHref: item.primaryCtaHref,
  };
}

export const ICON_OPTIONS = [
  { id: "Stethoscope", label: "Stethoscope (Clinical Care)" },
  { id: "Heart", label: "Heart (Maternal & Lactation)" },
  { id: "Droplets", label: "Droplets (WASH & Water Safety)" },
  { id: "Baby", label: "Baby (Infant & Newborn)" },
  { id: "MessageCircle", label: "Message Circle (AI Assistant)" },
];

export const ACCENT_OPTIONS = [
  { id: "bg-[#eef6f0] text-[#1c573e] border-[#d8e7dc]", label: "Forest Green (Clinical)" },
  { id: "bg-[#fcf4ec] text-[#b45d34] border-[#f0dfd0]", label: "Warm Clay (Lactation/Maternal)" },
  { id: "bg-[#edf6f9] text-[#1c647b] border-[#d4e7ee]", label: "Ocean Blue (WASH/Water)" },
  { id: "bg-[#f5eff9] text-[#643c82] border-[#e4d8ee]", label: "Soft Purple (Postnatal/Wellness)" },
];
