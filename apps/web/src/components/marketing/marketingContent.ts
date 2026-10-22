import { BookOpen, Heart, Leaf, type LucideIcon } from "lucide-react";

type LearningTopic = {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
  tint: string;
};

type ApproachStep = {
  number: string;
  title: string;
  description: string;
};

export const learningTopics: LearningTopic[] = [
  {
    number: "01",
    title: "Everyday wellbeing",
    description:
      "Build helpful routines with clear, practical guidance for daily life.",
    icon: Heart,
    tint: "bg-[#f8e8df] text-[#9b593e]",
  },
  {
    number: "02",
    title: "Food & nutrition",
    description:
      "Explore thoughtful food choices through familiar, culturally relevant learning.",
    icon: Leaf,
    tint: "bg-[#e5eddf] text-[#496742]",
  },
  {
    number: "03",
    title: "Family health",
    description:
      "Find approachable learning designed to support healthier family conversations.",
    icon: BookOpen,
    tint: "bg-[#e5edf0] text-[#476776]",
  },
];

export const approachSteps: ApproachStep[] = [
  {
    number: "01",
    title: "Made for real life",
    description:
      "Short, approachable topics help make health learning feel at home in your day.",
  },
  {
    number: "02",
    title: "Rooted in community",
    description:
      "Learning is shaped with Ethiopian families and familiar everyday contexts in mind.",
  },
  {
    number: "03",
    title: "Shared with care",
    description:
      "Trinity staff review content before it is published in the mobile app.",
  },
];

export const commitments = [
  "Amharic-first learning",
  "Practical, everyday topics",
  "Published with care",
];
