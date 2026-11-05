export type ContentStatus = "draft" | "published";

export const EDUCATION_CATEGORIES = [
  "Food safety",
  "Pregnancy nutrition",
  "Child nutrition",
  "Breastfeeding",
  "Clean water & hygiene",
];

export type EducationItem = {
  _id: string;
  title: string;
  titleAm: string;
  summary: string;
  summaryAm: string;
  content: string;
  contentAm: string;
  category: string;
  readMinutes: number;
  status: ContentStatus;
  publishedAt?: number;
  coverImageStorageId?: string;
  coverImageUrl?: string;
};

export type EducationForm = Omit<
  EducationItem,
  "_id" | "status" | "publishedAt" | "readMinutes"
> & { readMinutes: string };

export const emptyEducationForm: EducationForm = {
  title: "",
  titleAm: "",
  summary: "",
  summaryAm: "",
  content: "",
  contentAm: "",
  category: EDUCATION_CATEGORIES[0],
  readMinutes: "4",
  coverImageStorageId: undefined,
  coverImageUrl: "",
};

export function formFromItem(item: EducationItem): EducationForm {
  return {
    title: item.title,
    titleAm: item.titleAm,
    summary: item.summary,
    summaryAm: item.summaryAm,
    content: item.content,
    contentAm: item.contentAm,
    category: item.category,
    readMinutes: String(item.readMinutes),
    coverImageStorageId: item.coverImageStorageId,
    coverImageUrl: item.coverImageUrl || "",
  };
}
