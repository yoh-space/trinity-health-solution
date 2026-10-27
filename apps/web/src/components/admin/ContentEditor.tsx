"use client";

import { FormEvent } from "react";
import { EducationForm } from "./types";

type Props = {
  form: EducationForm;
  editing: boolean;
  saving: boolean;
  onChange: (field: keyof EducationForm, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
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
}: Props) {
  return (
    <form
      className="rounded-3xl border border-[#dce8de] bg-white p-6 shadow-sm"
      onSubmit={onSubmit}
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#579165]">
            {editing ? "EDIT CONTENT" : "NEW CONTENT"}
          </p>
          <h2 className="mt-2 text-2xl font-semibold">
            {editing ? "Refine this learning note" : "Create a learning note"}
          </h2>
          <p className="mt-1 text-sm text-[#637269]">
            Both English and Amharic versions are required before saving.
          </p>
        </div>
        {editing && (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm font-bold text-[#6d7e72]"
          >
            Cancel
          </button>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map(([field, label, placeholder]) => (
          <label className="grid gap-2 text-sm font-semibold" key={field}>
            {label}
            {field.includes("summary") ? (
              <textarea
                value={form[field]}
                onChange={(event) => onChange(field, event.target.value)}
                placeholder={placeholder}
                className="min-h-24 rounded-xl border border-[#cfddd1] px-3 py-2.5 font-normal outline-none placeholder:text-[#a1aea4] focus:border-[#287343]"
              />
            ) : (
              <input
                value={form[field]}
                onChange={(event) => onChange(field, event.target.value)}
                placeholder={placeholder}
                className="rounded-xl border border-[#cfddd1] px-3 py-2.5 font-normal outline-none placeholder:text-[#a1aea4] focus:border-[#287343]"
              />
            )}
          </label>
        ))}
        <label className="grid gap-2 text-sm font-semibold">
          Category
          <input
            value={form.category}
            onChange={(event) => onChange("category", event.target.value)}
            placeholder="Family wellbeing"
            className="rounded-xl border border-[#cfddd1] px-3 py-2.5 font-normal outline-none focus:border-[#287343]"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Read time (minutes)
          <input
            min="1"
            max="60"
            type="number"
            value={form.readMinutes}
            onChange={(event) => onChange("readMinutes", event.target.value)}
            className="rounded-xl border border-[#cfddd1] px-3 py-2.5 font-normal outline-none focus:border-[#287343]"
          />
        </label>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold">
          English article
          <textarea
            value={form.content}
            onChange={(event) => onChange("content", event.target.value)}
            placeholder="Write the practical learning note in English..."
            className="min-h-52 rounded-xl border border-[#cfddd1] px-3 py-2.5 font-normal outline-none placeholder:text-[#a1aea4] focus:border-[#287343]"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Amharic article
          <textarea
            value={form.contentAm}
            onChange={(event) => onChange("contentAm", event.target.value)}
            placeholder="የትምህርት ማስታወሻውን በአማርኛ ይጻፉ..."
            className="min-h-52 rounded-xl border border-[#cfddd1] px-3 py-2.5 font-normal outline-none placeholder:text-[#a1aea4] focus:border-[#287343]"
          />
        </label>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          className="rounded-full bg-[#287343] px-5 py-3 font-semibold text-white disabled:opacity-50"
          disabled={saving}
        >
          {saving ? "Saving…" : editing ? "Save changes" : "Save as draft"}
        </button>
        {editing && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-[#c9d8cb] px-5 py-3 text-sm font-semibold text-[#52705b]"
          >
            Discard changes
          </button>
        )}
      </div>
    </form>
  );
}
