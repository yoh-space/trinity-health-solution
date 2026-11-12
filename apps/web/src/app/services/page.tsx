import type { Metadata } from "next";
import { ServicesPageContent } from "./ServicesPageContent";

export const metadata: Metadata = {
  title: "Clinical & Community Services | Trinity Health Solution (አገልግሎቶች)",
  description:
    "Comprehensive maternal and infant healthcare services: antenatal care, lactation guidance, infant feeding plans, household WASH defense, and personalized telemedicine consultations for Ethiopian families.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Maternal & Infant Health Services | Trinity Health Solution",
    description:
      "Evidence-grounded prenatal, postnatal, lactation, and child nutrition services aligned with Ethiopian MoH and WHO guidelines.",
    url: "https://trinity-health-solution.vercel.app/services",
  },
};

export default function ServicesPage() {
  return <ServicesPageContent />;
}
