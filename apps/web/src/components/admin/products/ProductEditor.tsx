"use client";

import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { anyApi } from "convex/server";
import {
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  Plus,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShoppingBag,
} from "lucide-react";
import {
  ProductForm,
  PRODUCT_CATEGORIES,
} from "./types";

interface Props {
  form: ProductForm;
  editing: boolean;
  saving: boolean;
  onChange: <K extends keyof ProductForm>(field: K, value: ProductForm[K]) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function ProductEditor({
  form,
  editing,
  saving,
  onChange,
  onSubmit,
  onCancel,
}: Props) {
  const [activeLangTab, setActiveLangTab] = useState<"en" | "am">("en");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(anyApi.products.generateUploadUrl);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload an image file (PNG, JPG, WebP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Image size must be less than 10MB.");
      return;
    }

    setIsUploading(true);
    setUploadError("");

    try {
      const postUrl = await generateUploadUrl();
      const response = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!response.ok) {
        throw new Error("Image upload failed. Please try again.");
      }

      const { storageId } = await response.json();
      const localPreviewUrl = URL.createObjectURL(file);

      onChange("coverImageStorageId", storageId);
      onChange("coverImageUrl", localPreviewUrl);
    } catch (err: any) {
      setUploadError(err?.message || "Error uploading image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleHighlightChange = (
    lang: "en" | "am",
    index: number,
    value: string
  ) => {
    if (lang === "en") {
      const updated = [...form.highlightsEn];
      updated[index] = value;
      onChange("highlightsEn", updated);
    } else {
      const updated = [...form.highlightsAm];
      updated[index] = value;
      onChange("highlightsAm", updated);
    }
  };

  const addHighlight = (lang: "en" | "am") => {
    if (lang === "en") {
      onChange("highlightsEn", [...form.highlightsEn, ""]);
    } else {
      onChange("highlightsAm", [...form.highlightsAm, ""]);
    }
  };

  const removeHighlight = (lang: "en" | "am", index: number) => {
    if (lang === "en") {
      if (form.highlightsEn.length <= 1) return;
      onChange(
        "highlightsEn",
        form.highlightsEn.filter((_, i) => i !== index)
      );
    } else {
      if (form.highlightsAm.length <= 1) return;
      onChange(
        "highlightsAm",
        form.highlightsAm.filter((_, i) => i !== index)
      );
    }
  };

  return (
    <div className="rounded-3xl border border-[#dce6dc] bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e5ede5] pb-5">
        <div>
          <h3 className="text-xl font-extrabold text-[#163826]">
            {editing ? "Edit Product Details" : "Add New Maternal / Infant Product"}
          </h3>
          <p className="mt-1 text-xs text-[#526b5c]">
            Updates appear live on the /products catalog and ordering channels.
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
            English Fields
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
            አማርኛ (Amharic)
          </button>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-6">
        {/* Core Identifiers & Stock Switch */}
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-bold text-[#1f3b2a]">
              Unique Slug *
            </label>
            <input
              type="text"
              required
              disabled={editing}
              value={form.slug}
              onChange={(e) => onChange("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
              placeholder="e.g. lactation-tea"
              className="mt-1.5 w-full rounded-xl border border-[#cddad0] bg-white px-3.5 py-2 text-xs font-medium focus:border-[#1c573e] focus:outline-none disabled:bg-[#f6f8f5]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1f3b2a]">
              Product Category *
            </label>
            <select
              value={form.category}
              onChange={(e) => onChange("category", e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-[#cddad0] bg-white px-3.5 py-2 text-xs font-medium focus:border-[#1c573e] focus:outline-none"
            >
              {PRODUCT_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.labelEn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1f3b2a]">
              Inventory / Stock Status
            </label>
            <div className="mt-1.5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => onChange("inStock", !form.inStock)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  form.inStock ? "bg-[#1c573e]" : "bg-[#c6d1c6]"
                }`}
              >
                <span
                  className={`inline-block size-4 transform rounded-full bg-white transition ${
                    form.inStock ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className="text-xs font-semibold text-[#324f3c]">
                {form.inStock ? "In Stock (Available)" : "Out of Stock"}
              </span>
            </div>
          </div>
        </div>

        {/* Product Image Upload */}
        <div className="rounded-2xl border border-[#e1eae1] bg-[#fbfdfa] p-4">
          <label className="block text-xs font-bold text-[#1f3b2a]">
            Product Photography / Imagery
          </label>
          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center">
            {form.coverImageUrl ? (
              <div className="relative size-24 shrink-0 overflow-hidden rounded-xl border border-[#cbd8cb] bg-white">
                <img
                  src={form.coverImageUrl}
                  alt="Product preview"
                  className="size-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    onChange("coverImageStorageId", undefined);
                    onChange("coverImageUrl", "");
                  }}
                  className="absolute right-1 top-1 rounded-full bg-white/90 p-1 text-[#b53d3d] hover:bg-white"
                  title="Remove image"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ) : (
              <div className="flex size-24 shrink-0 items-center justify-center rounded-xl border border-dashed border-[#ccd9cc] bg-[#f4f7f2] text-[#86998b]">
                <ImageIcon size={24} />
              </div>
            )}

            <div className="flex-1 space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                className="hidden"
              />
              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-xl border border-[#cbd8cb] bg-white px-4 py-2 text-xs font-bold text-[#1c573e] hover:bg-[#f3f7f3] disabled:opacity-50"
              >
                {isUploading ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <UploadCloud size={13} />
                )}
                <span>{isUploading ? "Uploading..." : "Upload Product Photo"}</span>
              </button>
              <p className="text-[11px] text-[#788c7d]">
                PNG, JPG or WebP up to 10MB. Stored securely on Convex cloud storage.
              </p>
              {uploadError && (
                <p className="text-xs font-semibold text-[#b53d3d]">{uploadError}</p>
              )}
            </div>
          </div>
        </div>

        {/* English Tab Content */}
        {activeLangTab === "en" && (
          <div className="space-y-5 rounded-2xl border border-[#e1ece1] bg-[#fcfdfb] p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1c573e]">
              English Product Details
            </h4>

            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-bold text-[#1f3b2a]">
                  Badge (EN) *
                </label>
                <input
                  type="text"
                  required
                  value={form.badgeEn}
                  onChange={(e) => onChange("badgeEn", e.target.value)}
                  placeholder="e.g. Lactation Essential"
                  className="mt-1.5 w-full rounded-xl border border-[#cddad0] bg-white px-3.5 py-2 text-xs font-medium focus:border-[#1c573e] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1f3b2a]">
                  Product Title (EN) *
                </label>
                <input
                  type="text"
                  required
                  value={form.titleEn}
                  onChange={(e) => onChange("titleEn", e.target.value)}
                  placeholder="e.g. Trinity Mama Natural Lactation Tea"
                  className="mt-1.5 w-full rounded-xl border border-[#cddad0] bg-white px-3.5 py-2 text-xs font-medium focus:border-[#1c573e] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1f3b2a]">
                  Subtitle / Formulation (EN)
                </label>
                <input
                  type="text"
                  value={form.subtitleEn}
                  onChange={(e) => onChange("subtitleEn", e.target.value)}
                  placeholder="e.g. Herbal Galactagogue Blend"
                  className="mt-1.5 w-full rounded-xl border border-[#cddad0] bg-white px-3.5 py-2 text-xs font-medium focus:border-[#1c573e] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1f3b2a]">
                Description & Ingredients (EN) *
              </label>
              <textarea
                required
                rows={3}
                value={form.descriptionEn}
                onChange={(e) => onChange("descriptionEn", e.target.value)}
                placeholder="Detailed description of ingredients, benefits, and formulation..."
                className="mt-1.5 w-full rounded-xl border border-[#cddad0] bg-white p-3 text-xs font-medium focus:border-[#1c573e] focus:outline-none"
              />
            </div>

            {/* Highlights (EN) */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-[#1f3b2a]">
                  Key Benefits & Highlights (Bullets EN)
                </label>
                <button
                  type="button"
                  onClick={() => addHighlight("en")}
                  className="flex items-center gap-1 text-xs font-bold text-[#1c573e] hover:underline"
                >
                  <Plus size={13} />
                  <span>Add Benefit</span>
                </button>
              </div>

              <div className="mt-2 space-y-2">
                {form.highlightsEn.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-[#1c573e] shrink-0" />
                    <input
                      type="text"
                      required
                      value={item}
                      onChange={(e) => handleHighlightChange("en", idx, e.target.value)}
                      placeholder={`Benefit ${idx + 1}...`}
                      className="w-full rounded-xl border border-[#cddad0] bg-white px-3 py-2 text-xs font-medium focus:border-[#1c573e] focus:outline-none"
                    />
                    {form.highlightsEn.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeHighlight("en", idx)}
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
                  Ideal For / Recommended For (EN)
                </label>
                <input
                  type="text"
                  value={form.idealForEn}
                  onChange={(e) => onChange("idealForEn", e.target.value)}
                  placeholder="e.g. Nursing mothers seeking to boost breast milk volume."
                  className="mt-1.5 w-full rounded-xl border border-[#cddad0] bg-white px-3.5 py-2 text-xs font-medium focus:border-[#1c573e] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1f3b2a]">
                  Packaging Format / Quantity (EN)
                </label>
                <input
                  type="text"
                  value={form.formatEn}
                  onChange={(e) => onChange("formatEn", e.target.value)}
                  placeholder="e.g. Pack of 30 biodegradable sachets"
                  className="mt-1.5 w-full rounded-xl border border-[#cddad0] bg-white px-3.5 py-2 text-xs font-medium focus:border-[#1c573e] focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Amharic Tab Content */}
        {activeLangTab === "am" && (
          <div className="space-y-5 rounded-2xl border border-[#e1ece1] bg-[#fcfdfb] p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1c573e]">
              የምርቱ ዝርዝር በአማርኛ (Amharic Product Details)
            </h4>

            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-bold text-[#1f3b2a]">
                  የምርቱ ባጅ (AM) *
                </label>
                <input
                  type="text"
                  required
                  value={form.badgeAm}
                  onChange={(e) => onChange("badgeAm", e.target.value)}
                  placeholder="ምሳሌ፡ የጡት ወተት ማሳደጊያ"
                  className="mt-1.5 w-full rounded-xl border border-[#cddad0] bg-white px-3.5 py-2 text-xs font-medium focus:border-[#1c573e] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1f3b2a]">
                  የምርቱ ስም (AM) *
                </label>
                <input
                  type="text"
                  required
                  value={form.titleAm}
                  onChange={(e) => onChange("titleAm", e.target.value)}
                  placeholder="ምሳሌ፡ ትሪኒቲ ማማ የተፈጥሮ የጡት ወተት ሻይ"
                  className="mt-1.5 w-full rounded-xl border border-[#cddad0] bg-white px-3.5 py-2 text-xs font-medium focus:border-[#1c573e] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1f3b2a]">
                  ንዑስ ርዕስ (AM)
                </label>
                <input
                  type="text"
                  value={form.subtitleAm}
                  onChange={(e) => onChange("subtitleAm", e.target.value)}
                  placeholder="ምሳሌ፡ የተፈጥሮ እፅዋት ቅልቅል"
                  className="mt-1.5 w-full rounded-xl border border-[#cddad0] bg-white px-3.5 py-2 text-xs font-medium focus:border-[#1c573e] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1f3b2a]">
                ማብራሪያና ይዘት (AM) *
              </label>
              <textarea
                required
                rows={3}
                value={form.descriptionAm}
                onChange={(e) => onChange("descriptionAm", e.target.value)}
                placeholder="ስለ ምርቱ ንጥረ ነገሮችና ጥቅሞች ዝርዝር ማብራሪያ..."
                className="mt-1.5 w-full rounded-xl border border-[#cddad0] bg-white p-3 text-xs font-medium focus:border-[#1c573e] focus:outline-none"
              />
            </div>

            {/* Highlights (AM) */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-[#1f3b2a]">
                  ዋና ዋና ጥቅሞች (Bullets AM)
                </label>
                <button
                  type="button"
                  onClick={() => addHighlight("am")}
                  className="flex items-center gap-1 text-xs font-bold text-[#1c573e] hover:underline"
                >
                  <Plus size={13} />
                  <span>ጥቅም ጨምር</span>
                </button>
              </div>

              <div className="mt-2 space-y-2">
                {form.highlightsAm.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-[#1c573e] shrink-0" />
                    <input
                      type="text"
                      required
                      value={item}
                      onChange={(e) => handleHighlightChange("am", idx, e.target.value)}
                      placeholder={`ጥቅም ${idx + 1}...`}
                      className="w-full rounded-xl border border-[#cddad0] bg-white px-3 py-2 text-xs font-medium focus:border-[#1c573e] focus:outline-none"
                    />
                    {form.highlightsAm.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeHighlight("am", idx)}
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
                  ለማን ይመከራል? (AM)
                </label>
                <input
                  type="text"
                  value={form.idealForAm}
                  onChange={(e) => onChange("idealForAm", e.target.value)}
                  placeholder="ምሳሌ፡ የጡት ወተት መጠናቸው እንዲጨምር ለሚፈልጉ አጥቢ እናቶች።"
                  className="mt-1.5 w-full rounded-xl border border-[#cddad0] bg-white px-3.5 py-2 text-xs font-medium focus:border-[#1c573e] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1f3b2a]">
                  የማሸጊያው መጠን / ቅርጽ (AM)
                </label>
                <input
                  type="text"
                  value={form.formatAm}
                  onChange={(e) => onChange("formatAm", e.target.value)}
                  placeholder="ምሳሌ፡ የ30 ቀን መጠጫ ከረጢቶች"
                  className="mt-1.5 w-full rounded-xl border border-[#cddad0] bg-white px-3.5 py-2 text-xs font-medium focus:border-[#1c573e] focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Ordering Channels */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold text-[#1f3b2a]">
              Order Telegram Link
            </label>
            <input
              type="text"
              value={form.orderUrl}
              onChange={(e) => onChange("orderUrl", e.target.value)}
              placeholder="https://t.me/Trinity_health_solution"
              className="mt-1.5 w-full rounded-xl border border-[#cddad0] bg-white px-3.5 py-2 text-xs font-medium focus:border-[#1c573e] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1f3b2a]">
              Direct Phone Support Number
            </label>
            <input
              type="text"
              value={form.phoneContact}
              onChange={(e) => onChange("phoneContact", e.target.value)}
              placeholder="+251988720194"
              className="mt-1.5 w-full rounded-xl border border-[#cddad0] bg-white px-3.5 py-2 text-xs font-medium focus:border-[#1c573e] focus:outline-none"
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
              <span>Saving Product...</span>
            ) : (
              <span>{editing ? "Save Changes" : "Create Product"}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
