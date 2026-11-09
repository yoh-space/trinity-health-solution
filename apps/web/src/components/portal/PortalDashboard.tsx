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
  AlertCircle,
  FileText,
  Lock,
} from "lucide-react";
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

interface ClientAppointmentItem {
  _id: string;
  requestId: string;
  requestType: "clinical" | "counselling";
  requestSummary?: string;
  staffName: string;
  scheduledAt: number;
  durationMinutes: number;
  format: "online" | "inPerson";
  status: "scheduled";
}

interface PublishedEducationItem {
  _id: string;
  title: string;
  titleAm: string;
  category: string;
  readMinutes: number;
}

export function PortalDashboard() {
  const { user, isSignedIn, isLoaded } = useUser();
  const { openUserProfile, openSignIn } = useClerk();
  const { language, setLanguage, t } = useMarketingLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabParam = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(tabParam);
  
  // Keep state synced with URL search params
  const currentTab = searchParams.get("tab") || activeTab;

  // Live Convex query for user's care requests
  const careRequests = useQuery(
    anyApi.careRequests.listMine,
    isSignedIn ? {} : "skip"
  ) as CareRequestItem[] | undefined;
  const [now] = useState(() => Date.now());
  const clientAppointments = useQuery(
    anyApi.appointments.listMyClientAppointments,
    isSignedIn ? { now } : "skip"
  ) as ClientAppointmentItem[] | undefined;
  const publishedEducation = useQuery(anyApi.education.listPublished, {}) as
    | PublishedEducationItem[]
    | undefined;

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

  const activeRequestCount = careRequests?.filter((r) => r.status !== "closed").length;
  const nextAppointment = clientAppointments?.[0];

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      openSignIn({ fallbackRedirectUrl: "/portal", signUpFallbackRedirectUrl: "/portal" });
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
      await createCareRequest({
        consent: true,
        requestType: formType,
        contactMethod: formContactMethod,
        contactDetails: formContactDetails.trim(),
        ...(fullSummary ? { requestSummary: fullSummary.slice(0, 500) } : {}),
      });
      setFormSuccess("submitted");
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
                onClick={() => openSignIn({ fallbackRedirectUrl: "/portal", signUpFallbackRedirectUrl: "/portal" })}
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
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#1c573e]">
            MY CARE SPACE
          </span>
          <p className="mt-2 text-sm text-[#5d7364]">
            {language === "am"
              ? "የቤተሰብ ጤና ጥያቄዎችን፣ የምክክር ቀጠሮዎችንና የተዘጋጁ ትምህርቶችን በአንድ ቦታ ይከታተሉ።"
              : "Keep your health questions, appointments, and learning notes in one simple place."}
          </p>
        </div>

      </section>

      {currentTab === "overview" && (
        <>
          {/* --- 4-CARD TOP KPI SUMMARY --- */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              title="Active Care Requests"
              value={activeRequestCount?.toString() ?? "—"}
              subtitle={
                activeRequestCount === undefined
                  ? "Loading care requests"
                  : activeRequestCount > 0
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
              value={
                clientAppointments === undefined
                  ? "—"
                  : nextAppointment
                    ? new Date(nextAppointment.scheduledAt).toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })
                    : "None scheduled"
              }
              subtitle={
                clientAppointments === undefined
                  ? "Loading appointments"
                  : nextAppointment
                    ? `${new Date(nextAppointment.scheduledAt).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })} · ${nextAppointment.staffName}`
                    : "No upcoming appointments"
              }
              icon={Calendar}
              accent="blue"
              onClick={() => {
                setActiveTab("appointments");
                router.push("/portal?tab=appointments");
              }}
            />
            <SummaryCard
              title="Published Learning Notes"
              value={publishedEducation === undefined ? "—" : publishedEducation.length === 50 ? "50+" : String(publishedEducation.length)}
              subtitle={publishedEducation === undefined ? "Loading learning library" : "Available to read"}
              icon={BookOpen}
              accent="amber"
              onClick={() => {
                router.push("/learn");
              }}
            />
          </section>
        </>
      )}

      {/* --- TAB VIEW RENDERER --- */}

      {/* TAB 1: OVERVIEW */}
      {currentTab === "overview" && (
        <div className="space-y-8">
          {/* Active Request Live Banner */}
          {careRequests === undefined ? (
            <div className="rounded-3xl border border-[#dce8de] bg-white p-8 text-sm text-[#657a6b]">
              Loading care request history...
            </div>
          ) : careRequests.length > 0 ? (
            <div className="rounded-3xl border border-[#dce8de] bg-white p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-[#e8f0e8] pb-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1c573e]">
                      Latest request
                  </span>
                  <h3 className="mt-1 text-xl font-bold text-[#163826]">
                    {careRequests[0].requestType === "clinical"
                      ? "Health question"
                      : "Food and family guidance"}
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
                  Send a private question. Our care team will review it and contact you by phone or email.
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
                Send a question
              </button>
            </div>
          )}

          <div className="rounded-3xl border border-[#dce8de] bg-white p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#e8f0e8] pb-4">
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-[#1c573e]" />
                <h3 className="text-sm font-bold text-[#163826]">
                  Published Learning Notes
                </h3>
              </div>
              <Link
                href="/learn"
                className="text-xs font-bold text-[#1c573e] hover:underline"
              >
                Browse library
              </Link>
            </div>

            {publishedEducation === undefined ? (
              <p className="mt-4 text-sm text-[#657a6b]">Loading published notes...</p>
            ) : publishedEducation.length > 0 ? (
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {publishedEducation.slice(0, 3).map((item) => (
                  <Link
                    key={item._id}
                    href="/learn"
                    className="rounded-xl border border-[#e5ede4] bg-[#fbfdfa] p-4 transition hover:border-[#1c573e]"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#1c573e]">
                      {item.category}
                    </span>
                    <h4 className="mt-1 text-sm font-bold text-[#163826]">
                      {language === "am" ? item.titleAm : item.title}
                    </h4>
                    <p className="mt-2 text-xs text-[#718776]">
                      {item.readMinutes} min read
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-[#657a6b]">
                No published learning notes are available.
              </p>
            )}
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
                  <span>New question</span>
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
                          {req.requestType === "clinical" ? "Health question" : "Food and family guidance"}
                        </span>
                        <span className="text-[#cbd6cc]">•</span>
                        <span className="text-xs text-[#6e8574]">
                          {new Date(req.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="mt-1 text-base font-bold text-[#163826]">
                        {req.requestSummary || "Care request"}
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
                      <span>Your permission is recorded</span>
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
                <span>Send a question</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SEND A QUESTION */}
      {currentTab === "new-request" && (
        <div className="max-w-2xl">
          <div className="rounded-3xl border border-[#dce8de] bg-white p-6 sm:p-8 shadow-xs">
            <div className="border-b border-[#e4eee5] pb-5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1c573e]">
                GETTING THE RIGHT HELP
              </span>
              <h2 className="mt-1.5 text-2xl font-bold text-[#163826]">
                Submit a Care Request
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-[#5f7565]">
                Tell our care team what kind of help you need.
              </p>
            </div>

            {formSuccess ? (
              <div className="mt-6 rounded-2xl border border-[#cbe1cf] bg-[#f0f8f1] p-6 text-center space-y-4">
                <CheckCircle2 size={36} className="mx-auto text-[#1c573e]" />
                <h3 className="text-xl font-bold text-[#163826]">
                  Request Received!
                </h3>
                <p className="text-xs leading-relaxed text-[#43634c] max-w-md mx-auto">
                  Your question has been sent to the care team. Someone will review it and contact you using the details you provided.
                </p>
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
                    What do you need help with?
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
                      <p className="text-xs font-bold">Food and family guidance</p>
                      <p className="text-[11px] text-[#6d8272] mt-0.5">Meals, pregnancy, breastfeeding, and child feeding</p>
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
                      <p className="text-xs font-bold">Health question</p>
                      <p className="text-[11px] text-[#6d8272] mt-0.5">General health, pregnancy care, or safe water</p>
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
                      placeholder={formContactMethod === "phone" ? "Your phone number" : "Your email address"}
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
                    placeholder="Briefly describe the support you need..."
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
                <h3 className="text-xl font-bold text-[#163826]">Upcoming appointments</h3>
                  <p className="text-xs text-[#627768] mt-0.5">Your scheduled visits with the care team.</p>
              </div>
              {clientAppointments !== undefined && (
                <span className="rounded-full bg-[#eaf4eb] px-3 py-1 text-xs font-bold text-[#1c573e]">
                  {clientAppointments.length} upcoming
                </span>
              )}
            </div>

            {clientAppointments === undefined ? (
              <p className="mt-6 text-sm text-[#657a6b]">Loading appointments...</p>
            ) : clientAppointments.length > 0 ? (
              <div className="mt-6 space-y-4">
                {clientAppointments.map((appointment) => {
                  const date = new Date(appointment.scheduledAt);
                  return (
                    <article
                      key={appointment._id}
                      className="rounded-2xl border border-[#cbe0ce] bg-[#f5faf6] p-5"
                    >
                      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="flex items-start gap-3.5">
                          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#1c573e] text-white">
                            <Calendar size={20} />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1c573e]">
                              {appointment.format === "online" ? "Online consultation" : "In-person consultation"}
                            </span>
                            <h4 className="text-base font-bold text-[#163826]">
                              {appointment.requestSummary || `${appointment.requestType === "clinical" ? "Clinical" : "Counselling"} care request`}
                            </h4>
                            <p className="mt-0.5 text-xs text-[#5d7364]">
                              {date.toLocaleDateString(undefined, {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                              })} at {date.toLocaleTimeString(undefined, {
                                hour: "numeric",
                                minute: "2-digit",
                              })} · {appointment.staffName}
                            </p>
                          </div>
                        </div>
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-800">
                          Scheduled · {appointment.durationMinutes} min
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <p className="mt-6 rounded-2xl border border-dashed border-[#ccd9cc] p-8 text-center text-sm text-[#657a6b]">
                No upcoming appointments.
              </p>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: LEARNING NOTES */}
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

            <div className="mt-6 rounded-2xl border border-dashed border-[#ccd9cc] p-8 text-center">
              <Bookmark size={28} className="mx-auto text-[#799080]" />
              <p className="mt-3 text-sm text-[#657a6b]">
                No saved learning notes are available.
              </p>
              <Link href="/learn" className="mt-3 inline-block text-xs font-bold text-[#1c573e] hover:underline">
                Browse the learning library
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: PROFILE & PREFERENCES */}
      {currentTab === "profile" && (
        <div className="max-w-2xl space-y-6">
          <div className="rounded-3xl border border-[#dce8de] bg-white p-6 sm:p-8 shadow-xs">
            <div className="border-b border-[#e2eae1] pb-4">
              <h3 className="text-xl font-bold text-[#163826]">My details and preferences</h3>
              <p className="text-xs text-[#627768] mt-0.5">Update your personal details and language.</p>
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
                    <p className="text-[11px] text-[#6d8272]">Manage your sign-in methods, phone number, and active sessions.</p>
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

