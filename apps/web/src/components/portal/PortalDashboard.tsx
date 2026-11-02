"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { anyApi } from "convex/server";
import {
  ArrowRight,
  ClipboardList,
  Calendar,
  Bookmark,
  PlusCircle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  User,
  Settings,
  HelpCircle,
  BookOpen,
  Utensils,
  AlertCircle,
  FileText,
  Lock,
} from "lucide-react";
import { ClientAuthModal } from "@/components/common/ClientAuthModal";
import { useMarketingLanguage } from "@/components/marketing/MarketingLanguageContext";

interface CareRequestItem {
  _id: string;
  _creationTime: number;
  requestType: "clinical" | "counselling";
  contactMethod: "email" | "phone";
  contactDetails: string;
  requestSummary?: string;
  status: "submitted" | "inReview" | "contacted" | "closed";
  consentedAt: number;
  createdAt: number;
  updatedAt: number;
}

export function PortalDashboard() {
  const { user, isSignedIn, isLoaded } = useUser();
  const { openUserProfile } = useClerk();
  const { language, setLanguage, t } = useMarketingLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabParam = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(tabParam);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Keep state synced with URL search params
  const currentTab = searchParams.get("tab") || activeTab;

  // Live Convex query for user's care requests
  const careRequests = useQuery(
    anyApi.careRequests.listMine,
    isSignedIn ? {} : "skip"
  ) as CareRequestItem[] | undefined;

  // New Care Request Form State
  const createCareRequest = useMutation(anyApi.careRequests.create);
  const [formType, setFormType] = useState<"counselling" | "clinical">("counselling");
  const [formCategory, setFormCategory] = useState("General family nutrition");
  const [formContactMethod, setFormContactMethod] = useState<"phone" | "email">("phone");
  const [formContactDetails, setFormContactDetails] = useState(
    user?.primaryPhoneNumber?.phoneNumber || user?.primaryEmailAddress?.emailAddress || ""
  );
  const [formSummary, setFormSummary] = useState("");
  const [formConsent, setFormConsent] = useState(true);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Status Filter for Requests Tab
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredRequests = useMemo(() => {
    if (!careRequests) return [];
    if (statusFilter === "all") return careRequests;
    return careRequests.filter((r) => r.status === statusFilter);
  }, [careRequests, statusFilter]);

  const activeRequestCount = careRequests?.filter((r) => r.status !== "closed").length ?? 0;

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      setAuthModalOpen(true);
      return;
    }
    if (!formContactDetails.trim()) {
      setFormError("Please provide your phone number or email.");
      return;
    }
    setFormSubmitting(true);
    setFormError(null);
    try {
      const fullSummary = `[${formCategory}] ${formSummary.trim()}`.trim();
      const requestId = await createCareRequest({
        consent: true,
        requestType: formType,
        contactMethod: formContactMethod,
        contactDetails: formContactDetails.trim(),
        ...(fullSummary ? { requestSummary: fullSummary.slice(0, 500) } : {}),
      });
      setFormSuccess(requestId as string);
      setFormSummary("");
    } catch (err: any) {
      setFormError(err?.message || "Failed to submit request. Please verify your details.");
    } finally {
      setFormSubmitting(false);
    }
  };

  // If user is NOT signed in: Show Welcoming Portal Landing View
  if (isLoaded && !isSignedIn) {
    return (
      <div className="py-6 sm:py-10">
        <section className="relative overflow-hidden rounded-3xl border border-[#dce6dc] bg-white p-8 sm:p-12 shadow-sm">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#eaf4eb] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#1c573e]">
              <ShieldCheck size={14} />
              {t("Verified Care Space", "የተረጋገጠ የተገልጋይ መድረክ")}
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#163826] sm:text-5xl">
              {t("Welcome to Trinity Client Portal", "እንኳን ወደ ትሪኒቲ የተገልጋይ ፖርታል በደህና መጡ")}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-[#597161]">
              {t(
                "Sign in to track your family health inquiries, schedule clinical consultations with our community health team, and bookmark nutrition lessons.",
                "የቤተሰብ ጤና ጥያቄዎችን ለመከታተል፣ ከህክምና ቡድናችን ጋር የምክክር ቀጠሮ ለመያዝ እና የትምህርት ማስታወሻዎችን ለማስቀመጥ ይግቡ።"
              )}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center gap-2.5 rounded-full bg-[#1c573e] px-7 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#154631] active:scale-95"
              >
                <span>{t("Sign In to Access Care Space", "ይግቡና ፖርታልዎን ይክፈቱ")}</span>
                <ArrowRight size={16} />
              </button>

              <Link
                href="/learn"
                className="flex items-center gap-2 rounded-full border border-[#cbd8cb] bg-[#f8faf7] px-6 py-3.5 text-sm font-bold text-[#274935] transition hover:bg-white"
              >
                <BookOpen size={16} />
                <span>{t("Explore Free Learning Library", "ትምህርቶችን በነፃ ይመልከቱ")}</span>
              </Link>
            </div>
          </div>

          <ClientAuthModal
            isOpen={authModalOpen}
            onClose={() => setAuthModalOpen(false)}
          />
        </section>
      </div>
    );
  }

  const displayName = user?.firstName || user?.fullName || "there";

  return (
    <div className="space-y-8">
      {/* --- DASHBOARD HEADER GREETING --- */}
      <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end border-b border-[#e2eae1] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#1c573e]">
              PERSONAL CARE SPACE
            </span>
            <span className="text-[#cbd6cc]">•</span>
            <span className="text-xs font-semibold text-[#667e6e]">
              Active Session
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#163826] sm:text-4xl">
            {language === "am" ? `ጤና ይስጥልኝ፣ ${displayName}` : `Good day, ${displayName}`}
          </h1>
          <p className="mt-2 text-sm text-[#5d7364]">
            {language === "am"
              ? "የቤተሰብ ጤና ጥያቄዎችን፣ የምክክር ቀጠሮዎችንና የተዘጋጁ ትምህርቶችን በአንድ ቦታ ይከታተሉ።"
              : "A dedicated workspace to organize family health inquiries, clinical consultations, and verified lessons."}
          </p>
        </div>

        {/* Action Button */}
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => {
              setActiveTab("new-request");
              router.push("/portal?tab=new-request");
            }}
            className="inline-flex items-center gap-2 rounded-full bg-[#1c573e] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#154631] active:scale-95"
          >
            <PlusCircle size={15} />
            <span>{language === "am" ? "አዲስ ጥያቄ አቅርብ" : "Request Support"}</span>
          </button>
          <Link
            href="/ask-opal"
            className="inline-flex items-center gap-2 rounded-full border border-[#cbd8cb] bg-white px-4 py-2.5 text-xs font-semibold text-[#274c37] transition hover:bg-[#f2f7f1]"
          >
            <HelpCircle size={15} />
            <span>{language === "am" ? "ኦፓልን ይጠይቁ" : "Ask Opal Guidance"}</span>
          </Link>
        </div>
      </section>

      {/* --- 4-CARD TOP KPI SUMMARY --- */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Active Care Requests"
          value={activeRequestCount.toString()}
          subtitle={
            activeRequestCount > 0
              ? `${activeRequestCount} awaiting response or in review`
              : "No pending requests"
          }
          icon={ClipboardList}
          accent="emerald"
          onClick={() => {
            setActiveTab("requests");
            router.push("/portal?tab=requests");
          }}
        />
        <SummaryCard
          title="Next Appointment"
          value="Thu 14:30"
          subtitle="Online · Nutrition Guidance"
          icon={Calendar}
          accent="blue"
          onClick={() => {
            setActiveTab("appointments");
            router.push("/portal?tab=appointments");
          }}
        />
        <SummaryCard
          title="Saved Curriculum Guides"
          value="4"
          subtitle="Food safety & maternal nutrition"
          icon={Bookmark}
          accent="amber"
          onClick={() => {
            setActiveTab("saved");
            router.push("/portal?tab=saved");
          }}
        />
        <SummaryCard
          title="Care Protocol Standard"
          value="WHO / UNICEF"
          subtitle="Community evidence aligned"
          icon={ShieldCheck}
          accent="purple"
          onClick={() => {
            setActiveTab("profile");
            router.push("/portal?tab=profile");
          }}
        />
      </section>

      {/* --- TAB VIEW RENDERER --- */}

      {/* TAB 1: OVERVIEW */}
      {currentTab === "overview" && (
        <div className="space-y-8">
          {/* Active Request Live Banner */}
          {careRequests && careRequests.length > 0 ? (
            <div className="rounded-3xl border border-[#dce8de] bg-white p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-[#e8f0e8] pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#1c573e]">
                      Latest Care Request Status
                    </span>
                    <span className="text-[#cbd6cc]">•</span>
                    <span className="text-xs text-[#6e8574]">
                      ID: {careRequests[0]._id.slice(-6)}
                    </span>
                  </div>
                  <h3 className="mt-1 text-xl font-bold text-[#163826]">
                    {careRequests[0].requestType === "clinical"
                      ? "Clinical Health Inquiry"
                      : "Family Nutrition & Lifestyle Counselling"}
                  </h3>
                </div>

                <StatusBadge status={careRequests[0].status} />
              </div>

              {/* Status Step Timeline */}
              <div className="my-6">
                <StatusTimeline status={careRequests[0].status} />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#edf3ec] text-xs text-[#5a7261]">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    {careRequests[0].contactMethod === "phone" ? (
                      <Phone size={13} className="text-[#1c573e]" />
                    ) : (
                      <Mail size={13} className="text-[#1c573e]" />
                    )}
                    <span>{careRequests[0].contactDetails}</span>
                  </span>
                  <span>•</span>
                  <span>Submitted {new Date(careRequests[0].createdAt).toLocaleDateString()}</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("requests");
                    router.push("/portal?tab=requests");
                  }}
                  className="font-bold text-[#1c573e] hover:underline flex items-center gap-1"
                >
                  <span>View all care requests ({careRequests.length})</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-[#dce8de] bg-white p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="max-w-xl">
                <span className="rounded-full bg-[#eaf4eb] px-3 py-1 text-xs font-bold text-[#1c573e]">
                  Ready to Support Your Family
                </span>
                <h3 className="mt-3 text-xl font-bold text-[#163826]">
                  Need guidance on food safety, pregnancy nutrition, or child feeding?
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#5e7464]">
                  Submit a confidential request. Our verified clinicians and nutrition staff will review and contact you via your preferred phone or email.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("new-request");
                  router.push("/portal?tab=new-request");
                }}
                className="shrink-0 rounded-2xl bg-[#1c573e] px-6 py-3 text-xs font-bold text-white shadow-xs hover:bg-[#154631] transition"
              >
                + Start a Care Request
              </button>
            </div>
          )}

          {/* Side-by-side Educational & Pantry Cards */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recommended Learning Guides */}
            <div className="rounded-3xl border border-[#dce8de] bg-white p-6 sm:p-7 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#e8f0e8] pb-4">
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-[#1c573e]" />
                  <h3 className="text-sm font-bold text-[#163826]">
                    Curated Community Curriculum
                  </h3>
                </div>
                <Link
                  href="/learn"
                  className="text-xs font-bold text-[#1c573e] hover:underline"
                >
                  Browse all notes
                </Link>
              </div>

              <div className="mt-4 space-y-3">
                <CurriculumItem
                  title="Safe Food Preparation in Ethiopian Kitchens"
                  titleAm="በኢትዮጵያ የወጥ ቤት ውስጥ አስተማማኝ የምግብ ዝግጅት"
                  category="Food Safety"
                  readMinutes={3}
                  slug="food-safety-kitchen"
                  language={language}
                />
                <CurriculumItem
                  title="Nutritious Eating During Pregnancy and Breastfeeding"
                  titleAm="በእርግዝና እና ጡት በማጥባት ወቅት ጠቃሚ የአመጋገብ ልማዶች"
                  category="Maternal Nutrition"
                  readMinutes={4}
                  slug="maternal-nutrition-pregnancy"
                  language={language}
                />
                <CurriculumItem
                  title="Complementary Feeding for Infants From 6 Months"
                  titleAm="ከ 6 ወር ጀምሮ ለህፃናት የሚሰጡ ተጨማሪ ምግቦች"
                  category="Child Nutrition"
                  readMinutes={3}
                  slug="infant-complementary-feeding"
                  language={language}
                />
              </div>
            </div>

            {/* Pantry Balanced Meal Suggestion */}
            <div className="rounded-3xl border border-[#dce8de] bg-[#fbfdfa] p-6 sm:p-7 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#e8f0e8] pb-4">
                  <div className="flex items-center gap-2">
                    <Utensils size={16} className="text-[#1c573e]" />
                    <h3 className="text-sm font-bold text-[#163826]">
                      Recommended Ethiopian Plate
                    </h3>
                  </div>
                  <span className="rounded-full bg-[#f2e7c9] px-2.5 py-0.5 text-[10px] font-bold text-[#825b18]">
                    Iron & Protein Rich
                  </span>
                </div>

                <div className="mt-4">
                  <h4 className="text-base font-bold text-[#163826]">
                    Teff Injera with Misir Wot and Gomen
                  </h4>
                  <p className="mt-1 text-xs text-[#5e7464] leading-relaxed">
                    Combines iron-rich whole teff with plant protein from lentils and dark leafy greens for natural folate and vitamin absorption.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold text-[#2d563d]">
                    <span className="rounded-lg bg-[#e8f2e7] px-2.5 py-1">Teff (ጤፍ)</span>
                    <span className="rounded-lg bg-[#e8f2e7] px-2.5 py-1">Lentils (ምስር)</span>
                    <span className="rounded-lg bg-[#e8f2e7] px-2.5 py-1">Collard Greens (ጎመን)</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#e8f0e8]">
                <Link
                  href="/#pantry"
                  className="flex items-center justify-between text-xs font-bold text-[#1c573e] hover:underline"
                >
                  <span>Explore Interactive Pantry combinations</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MY CARE REQUESTS */}
      {currentTab === "requests" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
            {/* Status Filter Pills */}
            <div className="flex flex-wrap gap-1.5 rounded-full border border-[#cbd8cb] bg-white p-1 text-xs font-bold">
              {["all", "submitted", "inReview", "contacted", "closed"].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-full px-3.5 py-1.5 transition capitalize ${
                    statusFilter === status
                      ? "bg-[#1c573e] text-white shadow-2xs"
                      : "text-[#5e7464] hover:text-[#163826]"
                  }`}
                >
                  {status === "all" ? "All Requests" : status === "inReview" ? "In Review" : status}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveTab("new-request");
                router.push("/portal?tab=new-request");
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#1c573e] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#154631] transition"
            >
              <PlusCircle size={14} />
              <span>+ New Request</span>
            </button>
          </div>

          {filteredRequests.length > 0 ? (
            <div className="grid gap-4">
              {filteredRequests.map((req) => (
                <div
                  key={req._id}
                  className="rounded-2xl border border-[#dce6dc] bg-white p-5 sm:p-6 shadow-2xs"
                >
                  <div className="flex flex-col sm:flex-row justify-between gap-3 sm:items-center border-b border-[#eef3ee] pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#1c573e] uppercase tracking-wider">
                          {req.requestType === "clinical" ? "Clinical Inquiry" : "Nutrition Counselling"}
                        </span>
                        <span className="text-[#cbd6cc]">•</span>
                        <span className="text-xs text-[#6e8574]">
                          {new Date(req.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="mt-1 text-base font-bold text-[#163826]">
                        {req.requestSummary || "General family health guidance request"}
                      </h4>
                    </div>
                    <StatusBadge status={req.status} />
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-xs text-[#5e7464]">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5 font-medium">
                        {req.contactMethod === "phone" ? <Phone size={13} /> : <Mail size={13} />}
                        <span>Contact: {req.contactDetails}</span>
                      </span>
                      <span>•</span>
                      <span>Consent verified</span>
                    </div>

                    <div className="text-[11px] text-[#788e7d]">
                      Reference: <code className="bg-[#f0f6f1] px-1.5 py-0.5 rounded font-mono">{req._id}</code>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-[#ccd9cc] bg-white p-12 text-center">
              <ClipboardList size={36} className="mx-auto text-[#799080]" />
              <h3 className="mt-3 text-lg font-bold text-[#163826]">
                No care requests found
              </h3>
              <p className="mt-1 text-xs text-[#657a6b] max-w-sm mx-auto">
                {statusFilter === "all"
                  ? "You have not submitted any health or nutrition requests yet."
                  : `There are no requests with status "${statusFilter}".`}
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("new-request");
                  router.push("/portal?tab=new-request");
                }}
                className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#1c573e] px-5 py-2.5 text-xs font-bold text-white shadow-xs"
              >
                <PlusCircle size={14} />
                <span>Submit a Request</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: REQUEST SUPPORT (NEW REQUEST) */}
      {currentTab === "new-request" && (
        <div className="max-w-2xl">
          <div className="rounded-3xl border border-[#dce8de] bg-white p-6 sm:p-8 shadow-xs">
            <div className="border-b border-[#e4eee5] pb-5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1c573e]">
                DIRECT CLINICAL & NUTRITION SUPPORT
              </span>
              <h2 className="mt-1.5 text-2xl font-bold text-[#163826]">
                Submit a Care Request
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-[#5f7565]">
                Tell our team what health guidance would be useful. We connect you with verified clinicians and nutrition counselors.
              </p>
            </div>

            {formSuccess ? (
              <div className="mt-6 rounded-2xl border border-[#cbe1cf] bg-[#f0f8f1] p-6 text-center space-y-4">
                <CheckCircle2 size={36} className="mx-auto text-[#1c573e]" />
                <h3 className="text-xl font-bold text-[#163826]">
                  Request Received!
                </h3>
                <p className="text-xs leading-relaxed text-[#43634c] max-w-md mx-auto">
                  Your request has been submitted to our care triage queue. A team member will review it and reach out via your provided contact details.
                </p>
                <div className="text-xs font-mono text-[#5b7863] bg-white border border-[#d5e5d8] rounded-xl p-2 inline-block">
                  Reference ID: {formSuccess}
                </div>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setFormSuccess(null);
                      setActiveTab("requests");
                      router.push("/portal?tab=requests");
                    }}
                    className="rounded-full bg-[#1c573e] px-5 py-2 text-xs font-bold text-white shadow-xs"
                  >
                    View in My Requests
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormSuccess(null)}
                    className="rounded-full border border-[#cbd8cb] bg-white px-5 py-2 text-xs font-bold text-[#254d38]"
                  >
                    Submit Another
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateRequest} className="mt-6 space-y-5">
                {formError && (
                  <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                    <AlertCircle size={15} />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Consultation Type */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#2d4937] mb-2">
                    Consultation Track
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormType("counselling")}
                      className={`rounded-2xl border p-3.5 text-left transition ${
                        formType === "counselling"
                          ? "border-[#1c573e] bg-[#f0f7f1] text-[#1c573e] ring-1 ring-[#1c573e]"
                          : "border-[#d8e3d8] bg-white text-[#4d6654] hover:bg-[#fafcfa]"
                      }`}
                    >
                      <p className="text-xs font-bold">Nutrition Counselling</p>
                      <p className="text-[11px] text-[#6d8272] mt-0.5">Family diet, pregnancy meals & weaning</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormType("clinical")}
                      className={`rounded-2xl border p-3.5 text-left transition ${
                        formType === "clinical"
                          ? "border-[#1c573e] bg-[#f0f7f1] text-[#1c573e] ring-1 ring-[#1c573e]"
                          : "border-[#d8e3d8] bg-white text-[#4d6654] hover:bg-[#fafcfa]"
                      }`}
                    >
                      <p className="text-xs font-bold">Clinical Health Inquiry</p>
                      <p className="text-[11px] text-[#6d8272] mt-0.5">Maternal care, hygiene & general health</p>
                    </button>
                  </div>
                </div>

                {/* Topic Category */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#2d4937] mb-1.5">
                    Primary Topic
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full rounded-xl border border-[#cbd8cb] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#163826] outline-none focus:border-[#1c573e]"
                  >
                    <option>General family nutrition</option>
                    <option>Pregnancy and breastfeeding nutrition</option>
                    <option>Child and infant complementary feeding</option>
                    <option>Safe drinking water and home sanitation</option>
                    <option>Chronic condition dietary support</option>
                  </select>
                </div>

                {/* Contact Method & Detail */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#2d4937] mb-1.5">
                      Preferred Contact Channel
                    </label>
                    <select
                      value={formContactMethod}
                      onChange={(e) => setFormContactMethod(e.target.value as "phone" | "email")}
                      className="w-full rounded-xl border border-[#cbd8cb] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#163826] outline-none focus:border-[#1c573e]"
                    >
                      <option value="phone">Phone Call / SMS</option>
                      <option value="email">Email</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#2d4937] mb-1.5">
                      {formContactMethod === "phone" ? "Phone Number" : "Email Address"}
                    </label>
                    <input
                      type={formContactMethod === "phone" ? "tel" : "email"}
                      value={formContactDetails}
                      onChange={(e) => setFormContactDetails(e.target.value)}
                      placeholder={formContactMethod === "phone" ? "+251 91 123 4567" : "name@example.com"}
                      required
                      className="w-full rounded-xl border border-[#cbd8cb] bg-white px-3.5 py-2.5 text-xs text-[#163826] outline-none focus:border-[#1c573e]"
                    />
                  </div>
                </div>

                {/* Short General Note */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#2d4937] mb-1.5">
                    Brief Inquiry Summary (Optional)
                  </label>
                  <textarea
                    value={formSummary}
                    onChange={(e) => setFormSummary(e.target.value)}
                    maxLength={500}
                    rows={3}
                    placeholder="For example: I would like guidance on balanced meals using local Ethiopian lentils and grains."
                    className="w-full rounded-xl border border-[#cbd8cb] bg-white p-3 text-xs text-[#163826] outline-none focus:border-[#1c573e] placeholder:text-[#889d8d]"
                  />
                  <p className="mt-1 text-right text-[10px] text-[#718776]">
                    {formSummary.length}/500 characters
                  </p>
                </div>

                {/* Consent & Emergency Notice */}
                <div className="rounded-2xl border border-[#e1ece1] bg-[#f8faf8] p-4 text-xs text-[#4b6352] space-y-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formConsent}
                      onChange={(e) => setFormConsent(e.target.checked)}
                      required
                      className="mt-0.5 rounded border-[#a9c2ad] text-[#1c573e] focus:ring-[#1c573e]"
                    />
                    <span className="text-[11px] leading-relaxed">
                      I consent to Trinity health staff contacting me with verified public health educational guidance.
                    </span>
                  </label>
                  <p className="text-[10px] text-[#728777] border-t border-[#e5eee5] pt-2">
                    Notice: This form provides educational health guidance. For medical emergencies or acute symptoms, contact your local clinic directly.
                  </p>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={formSubmitting || !formConsent}
                  className="w-full rounded-2xl bg-[#1c573e] py-3.5 text-xs font-bold text-white shadow-xs hover:bg-[#154631] transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  <PlusCircle size={15} />
                  <span>{formSubmitting ? "Submitting..." : "Submit Care Request"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: APPOINTMENTS */}
      {currentTab === "appointments" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-[#dce8de] bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#e2eae1] pb-4">
              <div>
                <h3 className="text-xl font-bold text-[#163826]">Upcoming Consultations</h3>
                <p className="text-xs text-[#627768] mt-0.5">Confirmed sessions with Trinity clinicians and community counselors.</p>
              </div>
              <span className="rounded-full bg-[#eaf4eb] px-3 py-1 text-xs font-bold text-[#1c573e]">
                1 Confirmed
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-[#cbe0ce] bg-[#f5faf6] p-5 flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
                <div className="flex items-start gap-3.5">
                  <div className="grid size-11 place-items-center rounded-xl bg-[#1c573e] text-white shrink-0">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#1c573e]">
                      Online Virtual Consultation
                    </span>
                    <h4 className="text-base font-bold text-[#163826]">
                      Pregnancy & Breastfeeding Nutrition Review
                    </h4>
                    <p className="text-xs text-[#5d7364] mt-0.5">
                      Thursday, 14:30 EAT · With Dr. Almaz Bekele (Maternal Health)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-800">
                    Confirmed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SAVED GUIDES */}
      {currentTab === "saved" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-[#dce8de] bg-white p-6 sm:p-8 shadow-xs">
            <div className="border-b border-[#e2eae1] pb-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-[#163826]">Saved Curriculum Notes</h3>
                <p className="text-xs text-[#627768] mt-0.5">Quick access to bookmarked health & nutrition guides.</p>
              </div>
              <Link href="/learn" className="text-xs font-bold text-[#1c573e] hover:underline">
                Explore More Notes
              </Link>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <SavedNoteCard
                title="Safe Food Preparation in Ethiopian Kitchens"
                category="Food Safety"
                readMinutes={3}
                slug="food-safety-kitchen"
              />
              <SavedNoteCard
                title="Nutritious Eating During Pregnancy and Breastfeeding"
                category="Maternal Nutrition"
                readMinutes={4}
                slug="maternal-nutrition-pregnancy"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: PROFILE & PREFERENCES */}
      {currentTab === "profile" && (
        <div className="max-w-2xl space-y-6">
          <div className="rounded-3xl border border-[#dce8de] bg-white p-6 sm:p-8 shadow-xs">
            <div className="border-b border-[#e2eae1] pb-4">
              <h3 className="text-xl font-bold text-[#163826]">Client Profile & Preferences</h3>
              <p className="text-xs text-[#627768] mt-0.5">Manage your personal details and communication preferences.</p>
            </div>

            <div className="mt-6 space-y-5">
              <div className="flex items-center gap-4">
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={displayName}
                    className="size-16 rounded-full object-cover ring-2 ring-[#1c573e]/20"
                  />
                ) : (
                  <div className="grid size-16 place-items-center rounded-full bg-[#1c573e] text-2xl font-bold text-white shadow-xs">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h4 className="text-lg font-bold text-[#163826]">{displayName}</h4>
                  <p className="text-xs text-[#64796a]">
                    {user?.primaryEmailAddress?.emailAddress || "Verified Client Account"}
                  </p>
                  <span className="mt-1 inline-block rounded-full bg-[#e8f2e7] px-2.5 py-0.5 text-[10px] font-bold text-[#1c573e]">
                    Active Member
                  </span>
                </div>
              </div>

              {/* Language Preference */}
              <div className="pt-4 border-t border-[#edf2ec]">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2e4737] mb-2">
                  Display & Content Language
                </label>
                <div className="flex rounded-full border border-[#cbd8cb] bg-white p-1 text-xs font-bold w-fit">
                  <button
                    type="button"
                    onClick={() => setLanguage("en")}
                    className={`rounded-full px-4 py-1.5 transition ${
                      language === "en" ? "bg-[#1c573e] text-white shadow-2xs" : "text-[#5e7464]"
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage("am")}
                    className={`rounded-full px-4 py-1.5 transition ${
                      language === "am" ? "bg-[#1c573e] text-white shadow-2xs" : "text-[#5e7464]"
                    }`}
                  >
                    አማርኛ (Amharic)
                  </button>
                </div>
              </div>

              {/* Account Security & Passwords */}
              <div className="pt-4 border-t border-[#edf2ec] flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-[#163826]">Account Security & Connected Methods</h5>
                  <p className="text-[11px] text-[#6d8272]">Manage Google OAuth, phone numbers, and active sessions.</p>
                </div>
                <button
                  type="button"
                  onClick={() => openUserProfile()}
                  className="rounded-full border border-[#cbd8cb] bg-white px-4 py-2 text-xs font-bold text-[#1c573e] hover:bg-[#f2f7f1]"
                >
                  Manage Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent,
  onClick,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  accent: "emerald" | "blue" | "amber" | "purple";
  onClick?: () => void;
}) {
  const accentStyles = {
    emerald: "bg-[#eaf4eb] text-[#1c573e]",
    blue: "bg-[#e8f1fa] text-[#1e5888]",
    amber: "bg-[#fdf4e2] text-[#8e6015]",
    purple: "bg-[#f3edf9] text-[#6a359c]",
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-3xl border border-[#dce6dc] bg-white p-5 shadow-xs transition hover:border-[#b6cab8] hover:shadow-sm ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#697f6f]">
          {title}
        </span>
        <div className={`grid size-9 place-items-center rounded-xl ${accentStyles[accent]}`}>
          <Icon size={17} />
        </div>
      </div>
      <p className="mt-3 text-2xl font-black text-[#163826] tracking-tight">{value}</p>
      <p className="mt-1 text-[11px] text-[#5e7464]">{subtitle}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: CareRequestItem["status"] }) {
  const configs = {
    submitted: { label: "Submitted", bg: "bg-[#fff6e6] text-[#8f5a14] border-amber-200" },
    inReview: { label: "Under Review", bg: "bg-[#ebf4ff] text-[#1b5b99] border-blue-200" },
    contacted: { label: "In Progress / Contacted", bg: "bg-[#e8f7ec] text-[#1b6b38] border-emerald-200" },
    closed: { label: "Completed", bg: "bg-[#f1f3f1] text-[#546b5a] border-slate-200" },
  };

  const current = configs[status] || configs.submitted;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${current.bg}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      <span>{current.label}</span>
    </span>
  );
}

function StatusTimeline({ status }: { status: CareRequestItem["status"] }) {
  const steps = [
    { key: "submitted", label: "Request Submitted" },
    { key: "inReview", label: "Under Clinical Review" },
    { key: "contacted", label: "Staff Contacted" },
    { key: "closed", label: "Guidance Complete" },
  ];

  const statusIndex = steps.findIndex((s) => s.key === status);
  const activeIdx = statusIndex >= 0 ? statusIndex : 0;

  return (
    <div className="grid grid-cols-4 gap-2 pt-2">
      {steps.map((step, idx) => {
        const isDone = idx <= activeIdx;
        const isCurrent = idx === activeIdx;

        return (
          <div key={step.key} className="text-center">
            <div
              className={`h-2 rounded-full mb-2 transition-all ${
                isDone ? "bg-[#1c573e]" : "bg-[#e4ece4]"
              } ${isCurrent ? "ring-2 ring-[#1c573e]/20" : ""}`}
            />
            <span
              className={`text-[10px] sm:text-xs font-bold leading-tight block ${
                isDone ? "text-[#163826]" : "text-[#8d9e91]"
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function CurriculumItem({
  title,
  titleAm,
  category,
  readMinutes,
  slug,
  language,
}: {
  title: string;
  titleAm: string;
  category: string;
  readMinutes: number;
  slug: string;
  language: "en" | "am";
}) {
  return (
    <Link
      href={`/learn/${slug}`}
      className="group flex items-center justify-between rounded-2xl border border-[#e5ede4] bg-[#fbfdfa] p-3.5 transition hover:border-[#1c573e] hover:bg-white"
    >
      <div className="min-w-0 pr-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#1c573e]">
          {category}
        </span>
        <h5 className="truncate text-xs font-bold text-[#163826] group-hover:text-[#1c573e]">
          {language === "am" ? titleAm : title}
        </h5>
      </div>
      <div className="flex items-center gap-1 text-[11px] font-semibold text-[#718776] shrink-0">
        <Clock size={12} />
        <span>{readMinutes} min</span>
      </div>
    </Link>
  );
}

function SavedNoteCard({
  title,
  category,
  readMinutes,
  slug,
}: {
  title: string;
  category: string;
  readMinutes: number;
  slug: string;
}) {
  return (
    <div className="rounded-2xl border border-[#dce6dc] bg-[#fbfdfb] p-4 flex flex-col justify-between">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#1c573e]">
          {category}
        </span>
        <h4 className="mt-1 text-sm font-bold text-[#163826]">{title}</h4>
      </div>
      <div className="mt-4 pt-3 border-t border-[#edf2ec] flex items-center justify-between text-xs">
        <span className="flex items-center gap-1 text-[#6b8271]">
          <Clock size={12} /> {readMinutes} min read
        </span>
        <Link
          href={`/learn/${slug}`}
          className="font-bold text-[#1c573e] hover:underline"
        >
          Read Note
        </Link>
      </div>
    </div>
  );
}
