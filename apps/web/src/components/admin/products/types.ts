export type ProductStatus = "draft" | "published";

export interface ProductItem {
  _id: string;
  slug: string;
  order: number;
  category: string;
  badgeEn: string;
  badgeAm: string;
  titleEn: string;
  titleAm: string;
  subtitleEn: string;
  subtitleAm: string;
  descriptionEn: string;
  descriptionAm: string;
  highlightsEn: string[];
  highlightsAm: string[];
  idealForEn: string;
  idealForAm: string;
  formatEn: string;
  formatAm: string;
  coverImageStorageId?: string;
  coverImageUrl?: string;
  orderUrl: string;
  phoneContact: string;
  inStock: boolean;
  status: ProductStatus;
  publishedAt?: number;
  updatedAt?: number;
}

export type ProductForm = {
  slug: string;
  order: number;
  category: string;
  badgeEn: string;
  badgeAm: string;
  titleEn: string;
  titleAm: string;
  subtitleEn: string;
  subtitleAm: string;
  descriptionEn: string;
  descriptionAm: string;
  highlightsEn: string[];
  highlightsAm: string[];
  idealForEn: string;
  idealForAm: string;
  formatEn: string;
  formatAm: string;
  coverImageStorageId?: string;
  coverImageUrl?: string;
  orderUrl: string;
  phoneContact: string;
  inStock: boolean;
};

export const emptyProductForm: ProductForm = {
  slug: "",
  order: 1,
  category: "lactation",
  badgeEn: "Maternal Essential",
  badgeAm: "የእናቶች አስፈላጊ ምርት",
  titleEn: "",
  titleAm: "",
  subtitleEn: "",
  subtitleAm: "",
  descriptionEn: "",
  descriptionAm: "",
  highlightsEn: [""],
  highlightsAm: [""],
  idealForEn: "",
  idealForAm: "",
  formatEn: "",
  formatAm: "",
  coverImageStorageId: undefined,
  coverImageUrl: "",
  orderUrl: "https://t.me/Trinity_health_solution",
  phoneContact: "+251988720194",
  inStock: true,
};

export function formFromProduct(item: ProductItem): ProductForm {
  return {
    slug: item.slug,
    order: item.order,
    category: item.category,
    badgeEn: item.badgeEn,
    badgeAm: item.badgeAm,
    titleEn: item.titleEn,
    titleAm: item.titleAm,
    subtitleEn: item.subtitleEn,
    subtitleAm: item.subtitleAm,
    descriptionEn: item.descriptionEn,
    descriptionAm: item.descriptionAm,
    highlightsEn: item.highlightsEn.length > 0 ? [...item.highlightsEn] : [""],
    highlightsAm: item.highlightsAm.length > 0 ? [...item.highlightsAm] : [""],
    idealForEn: item.idealForEn,
    idealForAm: item.idealForAm,
    formatEn: item.formatEn,
    formatAm: item.formatAm,
    coverImageStorageId: item.coverImageStorageId,
    coverImageUrl: item.coverImageUrl || "",
    orderUrl: item.orderUrl,
    phoneContact: item.phoneContact,
    inStock: item.inStock,
  };
}

export const PRODUCT_CATEGORIES = [
  { id: "lactation", labelEn: "Lactation & Postpartum Recovery", labelAm: "የጡት ማጥባትና አራስ" },
  { id: "weaning", labelEn: "Infant Complementary Feeding", labelAm: "የህፃናት ተጨማሪ ምግብ" },
  { id: "wash", labelEn: "Clean Water & Household WASH", labelAm: "ንጹህ ውሃና ንጽህና" },
  { id: "learning", labelEn: "Educational Toolkits", labelAm: "የትምህርት መገልገያዎች" },
];
