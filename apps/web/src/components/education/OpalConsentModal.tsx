"use client";

import { useState } from "react";
import { ShieldCheck, X, ArrowRight, UserCheck, Lock } from "lucide-react";

interface OpalConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (options: {
    includeProfileContext: boolean;
    audience?: "myself" | "child" | "caregiver";
    ageBand?: "under5" | "age5to17" | "age18to39" | "age40to59" | "age60plus";
    goals: Array<"healthyEating" | "familyMeals">;
  }) => void;
  language: "en" | "am";
  hasSavedProfile: boolean;
}

export function OpalConsentModal({
  isOpen,
  onClose,
  onConfirm,
  language,
  hasSavedProfile,
}: OpalConsentModalProps) {
  const am = language === "am";

  const [shareProfile, setShareProfile] = useState(false);
  const [audience, setAudience] = useState<"myself" | "child" | "caregiver" | "">("");
  const [ageBand, setAgeBand] = useState<
    "under5" | "age5to17" | "age18to39" | "age40to59" | "age60plus" | ""
  >("");
  const [goals, setGoals] = useState<Array<"healthyEating" | "familyMeals">>([]);

  if (!isOpen) return null;

  const handleAccept = () => {
    onConfirm({
      includeProfileContext: shareProfile,
      ...(audience ? { audience: audience as "myself" | "child" | "caregiver" } : {}),
      ...(ageBand
        ? {
            ageBand: ageBand as
              | "under5"
              | "age5to17"
              | "age18to39"
              | "age40to59"
              | "age60plus",
          }
        : {}),
      goals,
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="consent-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-[#d6dfd2] bg-white p-6 sm:p-8 shadow-2xl text-[#183b2d]">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label={am ? "ዝጋ" : "Close"}
          className="absolute right-5 top-5 rounded-full p-2 text-[#687f6f] hover:bg-[#f1f6f1] hover:text-[#183b2d] transition"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-[#eaf4eb] text-[#1c573e]">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h2 id="consent-title" className="text-lg font-bold tracking-tight text-[#163826]">
              {am ? "የመረጃ አያያዝ እና የአገልግሎት ስምምነት" : "Data Sharing & Educational Guidance"}
            </h2>
            <p className="text-xs text-[#5e7765]">
              {am ? "ከመጀመሪያው ጥያቄዎ በፊት የሚፈለግ ፈቃድ" : "Quick one-time check before your inquiry"}
            </p>
          </div>
        </div>

        {/* Core Privacy & Scope Disclosure */}
        <div className="mt-5 space-y-3 rounded-2xl border border-[#e2ede0] bg-[#f8faf7] p-4 text-xs leading-relaxed text-[#3a5241]">
          <div className="flex items-start gap-2.5">
            <Lock size={15} className="text-[#1c573e] shrink-0 mt-0.5" />
            <p>
              {am
                ? "ጥያቄዎን ለመመለስ ከትሪኒቲ የታተሙ የጤና ትምህርቶች ጋር ተዛምዶ በGoogle Gemini ይዘጋጃል። የግል ስም፣ ስልክ፣ ወይም ሌላ የግል ሚስጥር አያካትቱ።"
                : "Your health question and relevant Trinity curriculum passages are processed by Google Gemini to formulate evidence-based educational guidance. Never include real names, phone numbers, or private credentials."}
            </p>
          </div>

          <p className="border-t border-[#e3ece2] pt-2 text-[11px] text-[#637d6a]">
            {am
              ? "ማስታወሻ፡ ኦፓል አጠቃላይ የትምህርት መረጃ ብቻ ይሰጣል፤ ቀጥተኛ ምርመራ ወይም የግል መድኃኒት ማዘዣ አይሰጥም። ለአስቸኳይ ምልክቶች ወዲያውኑ በአቅራቢያዎ ወደሚገኝ ጤና ጣቢያ ያምሩ።"
              : "Notice: Opal provides community health education only, not clinical diagnosis or medical prescriptions. In emergencies, consult your nearest healthcare facility immediately."}
          </p>
        </div>

        {/* Optional Context Sharing Toggle */}
        <div className="mt-5 rounded-2xl border border-[#e5eee4] p-4 text-xs">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={shareProfile}
              onChange={(e) => setShareProfile(e.target.checked)}
              className="mt-0.5 size-4 accent-[#1c573e] rounded"
            />
            <div className="flex-1">
              <span className="font-bold text-[#183b2d]">
                {am ? "አጠቃላይ አውድ ማካተት (አማራጭ)" : "Include general learning context (optional)"}
              </span>
              <p className="mt-0.5 text-[11px] leading-relaxed text-[#68826f]">
                {am
                  ? "የተጠቃሚ ቡድንና የዕድሜ ክልል ብቻ ይካተታል። ምንም አይነት ሚስጥራዊ መረጃ አይላክም።"
                  : "Only broad non-identifying fields (audience, age band, learning goals) are included for more tailored answers."}
              </p>
            </div>
          </label>

          {shareProfile && (
            <div className="mt-4 pt-4 border-t border-[#edf3ec] space-y-3.5">
              {hasSavedProfile ? (
                <div className="flex items-center gap-2 rounded-xl bg-[#eef6ed] p-2.5 text-[11px] text-[#2c5339]">
                  <UserCheck size={14} />
                  <span>
                    {am
                      ? "የተቀመጠው አጠቃላይ የመገለጫ መረጃዎ ይጠቀማል።"
                      : "Using non-identifying context from your saved profile."}
                  </span>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-[11px] font-bold text-[#425a49] mb-1.5">
                      {am ? "ጥያቄው ለማን ነው?" : "Who is this question for?"}
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { id: "myself", en: "Myself", am: "ለራሴ" },
                        { id: "child", en: "My child", am: "ለልጄ" },
                        { id: "caregiver", en: "Someone I care for", am: "ለምንከባከበው ሰው" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setAudience(item.id as any)}
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                            audience === item.id
                              ? "bg-[#1c573e] text-white"
                              : "border border-[#d0ded0] bg-white text-[#47604f] hover:bg-[#f6faf5]"
                          }`}
                        >
                          {am ? item.am : item.en}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#425a49] mb-1.5">
                      {am ? "የዕድሜ ክልል" : "Age band"}
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { id: "under5", label: "< 5" },
                        { id: "age5to17", label: "5–17" },
                        { id: "age18to39", label: "18–39" },
                        { id: "age40to59", label: "40–59" },
                        { id: "age60plus", label: "60+" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setAgeBand(item.id as any)}
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                            ageBand === item.id
                              ? "bg-[#1c573e] text-white"
                              : "border border-[#d0ded0] bg-white text-[#47604f] hover:bg-[#f6faf5]"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#cbd8cb] bg-white px-5 py-2.5 text-xs font-bold text-[#47604f] hover:bg-[#f3f7f2] transition"
          >
            {am ? "ይቅር" : "Cancel"}
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="flex items-center justify-center gap-2 rounded-full bg-[#1c573e] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#154631] transition active:scale-95"
          >
            <span>{am ? "ተስማምቻለሁ፤ ጥያቄውን ላክ" : "Accept & Send Inquiry"}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
