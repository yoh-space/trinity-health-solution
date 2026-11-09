"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { anyApi } from "convex/server";
import { ArrowLeft, CheckCircle2, AlertCircle, PlusCircle, ShieldCheck } from "lucide-react";

export function ConsultationRequestForm() {
  const { user, isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const createCareRequest = useMutation(anyApi.careRequests.create);

    const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [type, setType] = useState<"counselling" | "clinical">("counselling");
  const [category, setCategory] = useState("General family nutrition");
  const [contactMethod, setContactMethod] = useState<"phone" | "email">("phone");
  const [contactDetails, setContactDetails] = useState(
    user?.primaryPhoneNumber?.phoneNumber || user?.primaryEmailAddress?.emailAddress || ""
  );
  const [note, setNote] = useState("");
  const [consent, setConsent] = useState(true);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isSignedIn) {
      openSignIn({ fallbackRedirectUrl: "/portal", signUpFallbackRedirectUrl: "/portal" });
      return;
    }
    if (!contactDetails.trim()) {
      setError("Please provide a valid contact phone number or email address.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const summary = `[${category}] ${note.trim()}`.trim();
      await createCareRequest({
        consent: true,
        requestType: type,
        contactMethod,
        contactDetails: contactDetails.trim(),
        ...(summary ? { requestSummary: summary.slice(0, 500) } : {}),
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || "Failed to submit request. Please check your information.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="max-w-2xl rounded-3xl border border-[#cbe1cf] bg-[#f0f8f1] p-8 text-center sm:p-10 shadow-xs">
        <CheckCircle2 size={44} className="mx-auto text-[#1c573e]" />
        <span className="mt-4 inline-block text-xs font-bold uppercase tracking-[0.18em] text-[#1c573e]">
          REQUEST RECEIVED
        </span>
        <h1 className="mt-2 text-3xl font-extrabold text-[#163826]">
          A little support is on its way.
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#496551] max-w-md mx-auto">
          Your question has been sent to the Trinity care team. Someone will review it and contact you.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/portal?tab=requests"
            className="rounded-full bg-[#1c573e] px-6 py-3 text-xs font-bold text-white shadow-xs hover:bg-[#154631] transition"
          >
            Track in My Requests
          </Link>
          <Link
            href="/portal"
            className="rounded-full border border-[#bcd4bf] bg-white px-6 py-3 text-xs font-bold text-[#1c573e] hover:bg-[#f5faf6] transition"
          >
            Back to Dashboard
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="max-w-3xl">
      <Link href="/portal" className="text-xs font-bold text-[#1c573e] hover:underline inline-flex items-center gap-1.5 mb-6">
        <ArrowLeft size={14} />
        <span>Back to Portal Overview</span>
      </Link>

      <form
        onSubmit={submit}
        className="rounded-3xl border border-[#dce8de] bg-white p-6 sm:p-8 shadow-xs"
      >
        <div className="border-b border-[#e5eee5] pb-5">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#1c573e]">
            CARE REQUEST
          </span>
          <h1 className="mt-1.5 text-3xl font-extrabold text-[#163826]">
            What health guidance would be useful?
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-[#597161]">
            Choose what you need help with. Our care team will contact you to assist you.
          </p>
        </div>

        {error && (
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        {/* Consultation Track */}
        <div className="mt-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#2e4a38] mb-2">
            What do you need help with?
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setType("counselling")}
              className={`rounded-2xl border p-4 text-left transition ${
                type === "counselling"
                  ? "border-[#1c573e] bg-[#f0f7f1] text-[#1c573e] ring-1 ring-[#1c573e]"
                  : "border-[#d8e3d8] bg-white text-[#4d6654] hover:bg-[#fafcfa]"
              }`}
            >
              <p className="text-xs font-bold">Food and family guidance</p>
              <p className="text-[11px] text-[#6e8574] mt-0.5">Meals, pregnancy, breastfeeding, and child feeding</p>
            </button>
            <button
              type="button"
              onClick={() => setType("clinical")}
              className={`rounded-2xl border p-4 text-left transition ${
                type === "clinical"
                  ? "border-[#1c573e] bg-[#f0f7f1] text-[#1c573e] ring-1 ring-[#1c573e]"
                  : "border-[#d8e3d8] bg-white text-[#4d6654] hover:bg-[#fafcfa]"
              }`}
            >
              <p className="text-xs font-bold">Health question</p>
              <p className="text-[11px] text-[#6e8574] mt-0.5">General health, pregnancy care, or safe water</p>
            </button>
          </div>
        </div>

        {/* Primary Topic */}
        <div className="mt-5">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#2e4a38] mb-1.5">
            Primary Topic
          </label>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full rounded-xl border border-[#cbd8cb] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#163826] outline-none focus:border-[#1c573e]"
          >
            <option>General family nutrition</option>
            <option>Pregnancy and breastfeeding nutrition</option>
            <option>Child and infant complementary feeding</option>
            <option>Safe drinking water and home sanitation</option>
            <option>Chronic condition dietary support</option>
          </select>
        </div>

        {/* Contact Method & Details */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#2e4a38] mb-1.5">
              Preferred Contact Channel
            </label>
            <select
              value={contactMethod}
              onChange={(event) => setContactMethod(event.target.value as "phone" | "email")}
              className="w-full rounded-xl border border-[#cbd8cb] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#163826] outline-none focus:border-[#1c573e]"
            >
              <option value="phone">Phone Call / SMS</option>
              <option value="email">Email</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#2e4a38] mb-1.5">
              {contactMethod === "phone" ? "Phone Number" : "Email Address"}
            </label>
            <input
              type={contactMethod === "phone" ? "tel" : "email"}
              value={contactDetails}
              onChange={(event) => setContactDetails(event.target.value)}
              placeholder={contactMethod === "phone" ? "Your phone number" : "Your email address"}
              required
              className="w-full rounded-xl border border-[#cbd8cb] bg-white px-3.5 py-2.5 text-xs text-[#163826] outline-none focus:border-[#1c573e]"
            />
          </div>
        </div>

        {/* Note Area */}
        <div className="mt-5">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#2e4a38] mb-1.5">
            Brief General Note (Optional)
          </label>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            maxLength={500}
            rows={3}
            placeholder="Briefly describe the support you need..."
            className="w-full rounded-xl border border-[#cbd8cb] bg-white p-3 text-xs text-[#163826] outline-none focus:border-[#1c573e] placeholder:text-[#889d8d]"
          />
          <p className="mt-1 text-right text-[10px] text-[#718776]">
            {note.length}/500 characters
          </p>
        </div>

        {/* Notice & Consent */}
        <div className="mt-5 rounded-2xl border border-[#e1ece1] bg-[#f8faf8] p-4 text-xs text-[#4b6352] space-y-2">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              required
              className="mt-0.5 rounded border-[#a9c2ad] text-[#1c573e] focus:ring-[#1c573e]"
            />
            <span className="text-[11px] leading-relaxed">
              I consent to Trinity health staff contacting me with verified public health educational guidance.
            </span>
          </label>
          <p className="text-[10px] text-[#728777] border-t border-[#e5eee5] pt-2">
            Notice: For emergencies, acute bleeding, or breathing difficulty, contact your local emergency service or health facility immediately.
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting || !consent}
          className="mt-6 w-full rounded-2xl bg-[#1c573e] py-3.5 text-xs font-bold text-white shadow-xs hover:bg-[#154631] transition disabled:opacity-60 flex items-center justify-center gap-2"
        >
          <PlusCircle size={15} />
          <span>{submitting ? "Submitting..." : "Submit Care Request"}</span>
        </button>
      </form>
    </div>
  );
}
