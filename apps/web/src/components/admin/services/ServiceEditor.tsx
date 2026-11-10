"use client";

import { useState } from "react";
import {
  Stethoscope,
  Heart,
  Droplets,
  Baby,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";
import {
  ServiceForm,
  ICON_OPTIONS,
  ACCENT_OPTIONS,
} from "./types";

interface Props {
  form: ServiceForm;
  editing: boolean;
  saving: boolean;
  onChange: <K extends keyof ServiceForm>(field: K, value: ServiceForm[K]) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function ServiceEditor({
  form,
  editing,
  saving,
  onChange,
  onSubmit,
  onCancel,
}: Props) {
  const [activeLangTab, setActiveLangTab] = useState<"en" | "am">("en");

  // Deliverables helpers
  const handleDeliverableChange = (
    lang: "en" | "am",
    index: number,
    value: string
  ) => {
    if (lang === "en") {
      const updated = [...form.deliverablesEn];
      updated[index] = value;
      onChange("deliverablesEn", updated);
    } else {
      const updated = [...form.deliverablesAm];
      updated[index] = value;
      onChange("deliverablesAm", updated);
    }
  };

  const addDeliverable = (lang: "en" | "am") => {
    if (lang === "en") {
      onChange("deliverablesEn", [...form.deliverablesEn, ""]);
    } else {
      onChange("deliverablesAm", [...form.deliverablesAm, ""]);
    }
  };

  const removeDeliverable = (lang: "en" | "am", index: number) => {
    if (lang === "en") {
      if (form.deliverablesEn.length <= 1) return;
      onChange(
        "deliverablesEn",
        form.deliverablesEn.filter((_, i) => i !== index)
      );
    } else {
      if (form.deliverablesAm.length <= 1) return;
      onChange(
        "deliverablesAm",
        form.deliverablesAm.filter((_, i) => i !== index)
      );
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e5ede5] pb-5">
        <div>
          <h3 className="text-base font-extrabold text-[#163826]">
            {editing ? "Edit Service Card" : "New Clinical Service Card"}
          </h3>
          <p className="mt-0.5 text-xs text-[#526b5c]">
            Syncs live to /services and homepage once published.
          </p>
        </div>

        {/* Language Pill Switcher */}
        <div className="flex items-center rounded-xl bg-[#f0f4ee] p-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveLangTab("en")}
            className={`rounded-lg px-3.5 py-1.5 transition ${
              activeLangTab === "en"
                ? "bg-white text-[#1c573e] shadow-xs"
                : "text-[#587061] hover:text-[#1c573e]"
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setActiveLangTab("am")}
            className={`rounded-lg px-3.5 py-1.5 transition ${
              activeLangTab === "am"
                ? "bg-white text-[#1c573e] shadow-xs"
                : "text-[#587061] hover:text-[#1c573e]"
            }`}
          >
            አማርኛ
          </button>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-6">
        {/* Core Identifiers */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold text-[#1f3b2a]">
              Unique Identifier / Slug *
            </label>
            <input
              type="text"
              required
              disabled={editing}
              value={form.slug}
              onChange={(e) => onChange("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
              placeholder="e.g. antenatal-care"
              className="mt-1.5 w-full rounded-xl border border-[#cddad0] bg-white px-3.5 py-2.5 text-xs font-medium text-[#1c3a28] shadow-2xs focus:border-[#1c573e] focus:outline-none disabled:bg-[#f6f8f5]"
            />
            <p className="mt-1 text-[11px] text-[#718576]">Used for stable URLs and system referencing.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1f3b2a]">
              Display Order Weight
            </label>
            <input
              type="number"
              min={1}
              max={99}
              required
              value={form.order}
              onChange={(e) => onChange("order", parseInt(e.target.value) || 1)}
              className="mt-1.5 w-full rounded-xl border border-[#cddad0] bg-white px-3.5 py-2.5 text-xs font-medium text-[#1c3a28] shadow-2xs focus:border-[#1c573e] focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-[#718576]">Order in which this service appears (1 is first).</p>
          </div>
        </div>

        {/* English Content Pane */}
        {activeLangTab === "en" && (
          <div className="space-y-5 rounded-2xl border border-[#e1ece1] bg-[#fcfdfb] p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1c573e]">
              English Content Configuration
            </h4>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-[#1f3b2a]">
                  Badge / Sub-header (EN) *
                </label>
                <input
                  type="text"
                  required
                  value={form.badgeEn}
                  onChange={(e) => onChange("badgeEn", e.target.value)}
                  placeholder="e.g. Clinical Pillar 1"
                  className="mt-1.5 w-full rounded-xl border border-[#cddad0] bg-white px-3.5 py-2 text-xs font-medium focus:border-[#1c573e] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1f3b2a]">
                  Service Title (EN) *
                </label>
                <input
                  type="text"
                  required
                  value={form.categoryEn}
                  onChange={(e) => onChange("categoryEn", e.target.value)}
                  placeholder="e.g. Preconception & Antenatal Care (ANC)"
                  className="mt-1.5 w-full rounded-xl border border-[#cddad0] bg-white px-3.5 py-2 text-xs font-medium focus:border-[#1c573e] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1f3b2a]">
                Lead Tagline / Summary (EN) *
              </label>
              <textarea
                required
                rows={2}
                value={form.taglineEn}
                onChange={(e) => onChange("taglineEn", e.target.value)}
                placeholder="Clear 1-2 sentence description of the service scope..."
                className="mt-1.5 w-full rounded-xl border border-[#cddad0] bg-white p-3 text-xs font-medium focus:border-[#1c573e] focus:outline-none"
              />
            </div>

            {/* Scope Deliverables (EN) */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-[#1f3b2a]">
                  Scope of Care Deliverables (Bullet Points EN)
                </label>
                <button
                  type="button"
                  onClick={() => addDeliverable("en")}
                  className="flex items-center gap-1 text-xs font-bold text-[#1c573e] hover:underline"
                >
                  <Plus size={13} />
                  <span>Add Bullet Point</span>
                </button>
              </div>

              <div className="mt-2 space-y-2">
                {form.deliverablesEn.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-[#1c573e] shrink-0" />
                    <input
                      type="text"
                      required
                      value={item}
                      onChange={(e) => handleDeliverableChange("en", idx, e.target.value)}
                      placeholder={`Deliverable ${idx + 1}...`}
                      className="w-full rounded-xl border border-[#cddad0] bg-white px-3 py-2 text-xs font-medium focus:border-[#1c573e] focus:outline-none"
                    />
                    {form.deliverablesEn.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDeliverable("en", idx)}
                        className="text-[#96a599] hover:text-[#b43d3d] p-1"
                        title="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-[#1f3b2a]">
                  Clinical Standard Guideline (EN)
                </label>
                <input
                  type="text"
                  value={form.guidelineEn}
                  onChange={(e) => onChange("guidelineEn", e.target.value)}
                  placeholder="e.g. Ethiopian National Antenatal Care Guideline 2022"
                  className="mt-1.5 w-full rounded-xl border border-[#cddad0] bg-white px-3.5 py-2 text-xs font-medium focus:border-[#1c573e] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1f3b2a]">
                  CTA Button Label (EN)
                </label>
                <input
                  type="text"
                  value={form.primaryCtaLabelEn}
                  onChange={(e) => onChange("primaryCtaLabelEn", e.target.value)}
                  placeholder="e.g. Schedule ANC Consultation"
                  className="mt-1.5 w-full rounded-xl border border-[#cddad0] bg-white px-3.5 py-2 text-xs font-medium focus:border-[#1c573e] focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Amharic Content Pane */}
        {activeLangTab === "am" && (
          <div className="space-y-5 rounded-2xl border border-[#e1ece1] bg-[#fcfdfb] p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1c573e]">
              የአማርኛ ይዘት ማስተካከያ (Amharic Content)
            </h4>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-[#1f3b2a]">
                  የካርድ መለያ ባጅ (AM) *
                </label>
                <input
                  type="text"
                  required
                  value={form.badgeAm}
                  onChange={(e) => onChange("badgeAm", e.target.value)}
                  placeholder="ምሳሌ፡ ክሊኒካል ምሰሶ 1"
                  className="mt-1.5 w-full rounded-xl border border-[#cddad0] bg-white px-3.5 py-2 text-xs font-medium focus:border-[#1c573e] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1f3b2a]">
                  የአገልግሎቱ ርዕስ (AM) *
                </label>
                <input
                  type="text"
                  required
                  value={form.categoryAm}
                  onChange={(e) => onChange("categoryAm", e.target.value)}
                  placeholder="ምሳሌ፡ የቅድመ እርግዝና እና የቅድመ ወሊድ ክትትል"
                  className="mt-1.5 w-full rounded-xl border border-[#cddad0] bg-white px-3.5 py-2 text-xs font-medium focus:border-[#1c573e] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1f3b2a]">
                አጭር ማጠቃለያ (AM) *
              </label>
              <textarea
                required
                rows={2}
                value={form.taglineAm}
                onChange={(e) => onChange("taglineAm", e.target.value)}
                placeholder="ስለ አገልግሎቱ አጭር ማብራሪያ..."
                className="mt-1.5 w-full rounded-xl border border-[#cddad0] bg-white p-3 text-xs font-medium focus:border-[#1c573e] focus:outline-none"
              />
            </div>

            {/* Scope Deliverables (AM) */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-[#1f3b2a]">
                  አገልግሎቱ የሚያካትታቸው ዝርዝሮች (AM)
                </label>
                <button
                  type="button"
                  onClick={() => addDeliverable("am")}
                  className="flex items-center gap-1 text-xs font-bold text-[#1c573e] hover:underline"
                >
                  <Plus size={13} />
                  <span>ነጥብ ጨምር</span>
                </button>
              </div>

              <div className="mt-2 space-y-2">
                {form.deliverablesAm.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-[#1c573e] shrink-0" />
                    <input
                      type="text"
                      required
                      value={item}
                      onChange={(e) => handleDeliverableChange("am", idx, e.target.value)}
                      placeholder={`ዝርዝር ${idx + 1}...`}
                      className="w-full rounded-xl border border-[#cddad0] bg-white px-3 py-2 text-xs font-medium focus:border-[#1c573e] focus:outline-none"
                    />
                    {form.deliverablesAm.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDeliverable("am", idx)}
                        className="text-[#96a599] hover:text-[#b43d3d] p-1"
                        title="አስወግድ"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-[#1f3b2a]">
                  የህክምና መስፈርት / መመሪያ (AM)
                </label>
                <input
                  type="text"
                  value={form.guidelineAm}
                  onChange={(e) => onChange("guidelineAm", e.target.value)}
                  placeholder="ምሳሌ፡ የኢትዮጵያ ብሄራዊ የቅድመ ወሊድ መመሪያ"
                  className="mt-1.5 w-full rounded-xl border border-[#cddad0] bg-white px-3.5 py-2 text-xs font-medium focus:border-[#1c573e] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1f3b2a]">
                  የቀጠሮ መያዣ ቁልፍ ስም (AM)
                </label>
                <input
                  type="text"
                  value={form.primaryCtaLabelAm}
                  onChange={(e) => onChange("primaryCtaLabelAm", e.target.value)}
                  placeholder="ምሳሌ፡ ቀጠሮ ይያዙ"
                  className="mt-1.5 w-full rounded-xl border border-[#cddad0] bg-white px-3.5 py-2 text-xs font-medium focus:border-[#1c573e] focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Visual Attributes (Icon, Accent Color, CTA Link) */}
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-bold text-[#1f3b2a]">
              Icon Symbol
            </label>
            <select
              value={form.icon}
              onChange={(e) => onChange("icon", e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-[#cddad0] bg-white px-3 py-2 text-xs font-medium focus:border-[#1c573e] focus:outline-none"
            >
              {ICON_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1f3b2a]">
              Accent Theme Color
            </label>
            <select
              value={form.accent}
              onChange={(e) => onChange("accent", e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-[#cddad0] bg-white px-3 py-2 text-xs font-medium focus:border-[#1c573e] focus:outline-none"
            >
              {ACCENT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1f3b2a]">
              CTA Button Link Destination
            </label>
            <input
              type="text"
              value={form.primaryCtaHref}
              onChange={(e) => onChange("primaryCtaHref", e.target.value)}
              placeholder="/portal/consultations/new"
              className="mt-1.5 w-full rounded-xl border border-[#cddad0] bg-white px-3 py-2 text-xs font-medium focus:border-[#1c573e] focus:outline-none"
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 border-t border-[#e5ede5] pt-5">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-[#ccd8ce] bg-white px-5 py-2.5 text-xs font-bold text-[#455c4d] hover:bg-[#f6f9f5]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1c573e] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#154631] disabled:opacity-50"
          >
            {saving ? (
              <span>Saving...</span>
            ) : (
              <span>{editing ? "Save Changes" : "Create Service"}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
