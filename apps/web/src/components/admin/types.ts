export type ContentStatus = "draft" | "published";

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
  category: "Family wellbeing",
  readMinutes: "4",
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
  };
}
