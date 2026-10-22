export type EducationItem = {
  _id: string;
  category: string;
  readMinutes: number;
  title: string;
  titleAm: string;
  summary: string;
  summaryAm: string;
  content: string;
  contentAm: string;
};

export const starterContent: EducationItem[] = [
  {
    _id: "starter-1",
    category: "Family wellbeing",
    readMinutes: 4,
    title: "Build a balanced family plate",
    titleAm: "ለቤተሰብ የተመጣጠነ ምግብ ያዘጋጁ",
    summary: "Simple, familiar foods can form a nourishing meal.",
    summaryAm: "ቀላል እና የምናውቃቸው ምግቦች ገንቢ ምግብ ሊሆኑ ይችላሉ።",
    content:
      "Choose familiar foods from different groups and make small changes that work for your household.",
    contentAm: "ከተለያዩ የምግብ ቡድኖች የምናውቃቸውን ምግቦች ይምረጡ፣ ለቤተሰብዎ የሚሰሩ ትንሽ ለውጦች ያድርጉ።",
  },
  {
    _id: "starter-2",
    category: "Daily habits",
    readMinutes: 3,
    title: "Small routines, stronger days",
    titleAm: "ትንሽ ልምዶች፣ የተሻሉ ቀናት",
    summary: "Make room for rest, water, movement, and shared meals.",
    summaryAm: "ለእረፍት፣ ለውሃ፣ ለእንቅስቃሴ እና ለጋራ ምግብ ቦታ ይስጡ።",
    content:
      "A supportive routine does not need to be perfect. Begin with one useful habit.",
    contentAm: "ደጋፊ ልምድ ፍጹም መሆን አይጠበቅበትም። በአንድ ጠቃሚ ልምድ ይጀምሩ።",
  },
];
