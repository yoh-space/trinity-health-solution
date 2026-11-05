"use client";

import { FormEvent, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { anyApi } from "convex/server";
import {
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { EducationForm } from "./types";

type Props = {
  form: EducationForm;
  editing: boolean;
  saving: boolean;
  onChange: (field: keyof EducationForm, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  categories: string[];
};

const fields: Array<[keyof EducationForm, string, string]> = [
  ["title", "English title", "A clear, family-friendly headline"],
  ["titleAm", "Amharic title", "ርዕስ በአማርኛ"],
  ["summary", "English summary", "One or two sentences for the library card"],
  ["summaryAm", "Amharic summary", "የአጭር ማጠቃለያ"],
];

export function ContentEditor({
  form,
  editing,
  saving,
  onChange,
  onSubmit,
  onCancel,
  categories,
}: Props) {
  const generateUploadUrl = useMutation(anyApi.education.generateUploadUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  async function handleFileUpload(file: File) {
    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload an image file (PNG, JPG, WebP, AVIF).");
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
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Error uploading image to storage.",
      );
    } finally {
      setIsUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }

  function removeCoverImage() {
    onChange("coverImageStorageId", "");
    onChange("coverImageUrl", "");
    setUploadError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <form
      className="rounded-3xl border border-[#dce8de] bg-white p-6 shadow-sm sm:p-8"
      onSubmit={onSubmit}
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#579165]">
            {editing ? "EDIT CONTENT" : "NEW CURRICULUM NOTE"}
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#163826]">
            {editing ? "Refine Learning Note" : "Create Learning Note"}
          </h2>
          <p className="mt-1 text-xs text-[#637269]">
            Both English and Amharic versions are required before publishing.
          </p>
        </div>
        {editing && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-[#d3ded3] px-3.5 py-1.5 text-xs font-bold text-[#55695a] hover:bg-[#f3f7f2]"
          >
            Cancel
          </button>
        )}
      </div>

      {/* --- Cover Image & Hero Section Pipeline --- */}
      <div className="mb-8 rounded-2xl border border-[#dfe7df] bg-[#fbfdfa] p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#1b3e2a] flex items-center gap-2">
              <ImageIcon size={16} className="text-[#1c573e]" />
              Hero & Cover Image
            </h3>
            <p className="text-[11px] text-[#6d8272]">
              Displayed in the article hero section and across mobile/web cards.
            </p>
          </div>

          <div className="flex items-center gap-1 rounded-full border border-[#d4ded3] bg-white p-0.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setUploadMode("file")}
              className={`rounded-full px-3 py-1 transition ${
                uploadMode === "file"
                  ? "bg-[#1c573e] text-white shadow-2xs"
                  : "text-[#55695a] hover:text-[#183925]"
              }`}
            >
              Upload File
            </button>
            <button
              type="button"
              onClick={() => setUploadMode("url")}
              className={`rounded-full px-3 py-1 transition ${
                uploadMode === "url"
                  ? "bg-[#1c573e] text-white shadow-2xs"
                  : "text-[#55695a] hover:text-[#183925]"
              }`}
            >
              Image URL
            </button>
          </div>
        </div>

        {/* Existing Image Hero Preview */}
        {form.coverImageUrl ? (
          <div className="relative mt-2 overflow-hidden rounded-xl border border-[#d5ded4] bg-white shadow-xs">
            <div className="relative aspect-21/9 w-full overflow-hidden bg-slate-900 sm:aspect-16/7">
              <img
                src={form.coverImageUrl}
                alt="Cover Preview"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                <div>
                  <span className="rounded-full bg-emerald-500/90 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-xs">
                    {form.category || "Family Health"}
                  </span>
                  <p className="mt-1 font-bold text-white text-sm line-clamp-1 drop-shadow-xs">
                    {form.title || "Untitled Learning Note"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={removeCoverImage}
                  className="flex items-center gap-1 rounded-lg bg-red-600/90 px-2.5 py-1 text-xs font-bold text-white shadow-sm hover:bg-red-700 backdrop-blur-xs"
                >
                  <Trash2 size={13} />
                  <span>Remove</span>
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between px-3 py-2 bg-[#f4f8f3] text-[11px] text-[#4d6353]">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 size={13} className="text-emerald-600" />
                Hero Image Configured
              </span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="font-bold text-[#1c573e] hover:underline"
              >
                Replace Image
              </button>
            </div>
          </div>
        ) : uploadMode === "file" ? (
          /* File Upload Dropzone */
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition ${
              isDragging
                ? "border-[#1c573e] bg-[#edf6ee]"
                : "border-[#cfddd1] bg-white hover:border-[#1c573e] hover:bg-[#f6faf5]"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />

            {isUploading ? (
              <div className="flex flex-col items-center gap-2 py-3 text-[#1c573e]">
                <Loader2 size={28} className="animate-spin text-[#1c573e]" />
                <span className="text-xs font-bold">Uploading image...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="grid size-11 place-items-center rounded-full bg-[#eef5ee] text-[#1c573e]">
                  <UploadCloud size={22} />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1f422e]">
                    Click to browse or drag and drop image
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#718575]">
                    PNG, JPG, WebP, AVIF up to 10MB
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Direct URL Input */
          <div className="mt-2 space-y-2">
            <div className="relative">
              <LinkIcon
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#809485]"
              />
              <input
                type="url"
                value={form.coverImageUrl || ""}
                onChange={(e) => onChange("coverImageUrl", e.target.value)}
                placeholder="https://images.unsplash.com/... or CDN link"
                className="w-full rounded-xl border border-[#cfddd1] bg-white py-2.5 pl-9 pr-3 text-xs font-medium text-[#1c3c29] outline-none placeholder:text-[#a1aea4] focus:border-[#1c573e]"
              />
            </div>
            <p className="text-[10px] text-[#788a7c]">
              Paste a direct HTTPS URL to a photographic cover image for this note.
            </p>
          </div>
        )}

        {uploadError && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 p-2 text-xs font-medium text-red-700">
            <AlertCircle size={14} className="shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}
      </div>

      {/* --- Article Text & Bilingual Fields --- */}
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map(([field, label, placeholder]) => (
          <label className="grid gap-2 text-xs font-bold text-[#1f3f2c]" key={field}>
            {label}
            {field.includes("summary") ? (
              <textarea
                value={form[field] || ""}
                onChange={(event) => onChange(field, event.target.value)}
                placeholder={placeholder}
                className="min-h-24 rounded-xl border border-[#cfddd1] px-3.5 py-2.5 text-xs font-normal text-[#173a25] outline-none placeholder:text-[#a1aea4] focus:border-[#1c573e]"
              />
            ) : (
              <input
                value={form[field] || ""}
                onChange={(event) => onChange(field, event.target.value)}
                placeholder={placeholder}
                className="rounded-xl border border-[#cfddd1] px-3.5 py-2.5 text-xs font-normal text-[#173a25] outline-none placeholder:text-[#a1aea4] focus:border-[#1c573e]"
              />
            )}
          </label>
        ))}

        <label className="grid gap-2 text-xs font-bold text-[#1f3f2c]">
          Category
          <select
            value={form.category}
            onChange={(event) => onChange("category", event.target.value)}
            required
            className="rounded-xl border border-[#cfddd1] bg-white px-3.5 py-2.5 text-xs font-normal text-[#173a25] outline-none focus:border-[#1c573e]"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-xs font-bold text-[#1f3f2c]">
          Read time (minutes)
          <input
            min="1"
            max="60"
            type="number"
            value={form.readMinutes}
            onChange={(event) => onChange("readMinutes", event.target.value)}
            className="rounded-xl border border-[#cfddd1] px-3.5 py-2.5 text-xs font-normal text-[#173a25] outline-none focus:border-[#1c573e]"
          />
        </label>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-xs font-bold text-[#1f3f2c]">
          English article content
          <textarea
            value={form.content}
            onChange={(event) => onChange("content", event.target.value)}
            placeholder="Write the practical learning note in English..."
            className="min-h-52 rounded-xl border border-[#cfddd1] px-3.5 py-2.5 text-xs font-normal leading-relaxed text-[#173a25] outline-none placeholder:text-[#a1aea4] focus:border-[#1c573e]"
          />
        </label>

        <label className="grid gap-2 text-xs font-bold text-[#1f3f2c]">
          Amharic article content (በአማርኛ)
          <textarea
            value={form.contentAm}
            onChange={(event) => onChange("contentAm", event.target.value)}
            placeholder="የትምህርት ማስታወሻውን በአማርኛ ይጻፉ..."
            className="min-h-52 rounded-xl border border-[#cfddd1] px-3.5 py-2.5 text-xs font-normal leading-relaxed text-[#173a25] outline-none placeholder:text-[#a1aea4] focus:border-[#1c573e]"
          />
        </label>
      </div>

      {/* --- Action Buttons --- */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="flex items-center gap-2 rounded-full bg-[#1c573e] px-6 py-3 text-xs font-bold text-white shadow-xs transition hover:bg-[#154631] active:scale-95 disabled:opacity-50"
          disabled={saving || isUploading}
        >
          {saving ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span>Saving...</span>
            </>
          ) : editing ? (
            <span>Save Changes</span>
          ) : (
            <span>Save as Draft</span>
          )}
        </button>

        {editing && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-[#c9d8cb] px-5 py-3 text-xs font-semibold text-[#52705b] hover:bg-[#f5f8f4]"
          >
            Discard Changes
          </button>
        )}
      </div>
    </form>
  );
}
