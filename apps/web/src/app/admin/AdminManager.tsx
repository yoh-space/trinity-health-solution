"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { anyApi } from "convex/server";

type EducationItem = {
  _id: string;
  title: string;
  category: string;
  readMinutes: number;
  status: "draft" | "published";
};

const emptyForm = {
  title: "",
  titleAm: "",
  summary: "",
  summaryAm: "",
  content: "",
  contentAm: "",
  category: "Family wellbeing",
  readMinutes: "4",
};

export default function AdminPage() {
  // The generated API regains full typing after `convex dev` is connected.
  const content = useQuery(anyApi.education.listForAdmin) as EducationItem[] | undefined;
  const create = useMutation(anyApi.education.create);
  const publish = useMutation(anyApi.education.publish);
  const remove = useMutation(anyApi.education.remove);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await create({ ...form, readMinutes: Number(form.readMinutes) });
      setForm(emptyForm);
      setMessage("Draft saved. Publish when it is ready for families.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save this item.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7faf6] px-5 py-10 text-[#183a25] md:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-sm font-bold tracking-[0.18em] text-[#087a3d]">TRINITY PUBLISHER</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight">Family learning library</h1>
            <p className="mt-3 max-w-xl leading-7 text-[#5c6b62]">
              Create bilingual, non-clinical learning for the Trinity mobile app.
            </p>
          </div>
          <span className="rounded-full bg-[#dcefe0] px-4 py-2 text-sm font-semibold text-[#087a3d]">
            Protected staff route
          </span>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <form className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#dce8de]" onSubmit={submit}>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">New learning item</h2>
              <p className="mt-1 text-sm text-[#637269]">Fields marked in both languages are required.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["title", "English title"],
                ["titleAm", "Amharic title"],
                ["summary", "English summary"],
                ["summaryAm", "Amharic summary"],
              ].map(([key, label]) => (
                <label className="grid gap-2 text-sm font-semibold" key={key}>
                  {label}
                  <input
                    className="rounded-xl border border-[#cfddd1] px-3 py-2.5 font-normal outline-none focus:border-[#087a3d]"
                    value={form[key as keyof typeof form]}
                    onChange={(event) => setForm({ ...form, [key]: event.target.value })}
                  />
                </label>
              ))}
              <label className="grid gap-2 text-sm font-semibold">
                Category
                <input className="rounded-xl border border-[#cfddd1] px-3 py-2.5 font-normal outline-none focus:border-[#087a3d]" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Read time (minutes)
                <input className="rounded-xl border border-[#cfddd1] px-3 py-2.5 font-normal outline-none focus:border-[#087a3d]" min="1" max="60" type="number" value={form.readMinutes} onChange={(event) => setForm({ ...form, readMinutes: event.target.value })} />
              </label>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {[
                ["content", "English article"],
                ["contentAm", "Amharic article"],
              ].map(([key, label]) => (
                <label className="grid gap-2 text-sm font-semibold" key={key}>
                  {label}
                  <textarea className="min-h-40 rounded-xl border border-[#cfddd1] px-3 py-2.5 font-normal outline-none focus:border-[#087a3d]" value={form[key as keyof typeof form]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} />
                </label>
              ))}
            </div>
            {message && <p className="mt-4 rounded-xl bg-[#edf7ee] px-4 py-3 text-sm text-[#245c32]">{message}</p>}
            <button className="mt-6 rounded-full bg-[#087a3d] px-5 py-3 font-semibold text-white disabled:opacity-50" disabled={saving}>
              {saving ? "Saving…" : "Save as draft"}
            </button>
          </form>

          <section className="rounded-3xl bg-[#173e27] p-6 text-white">
            <h2 className="text-2xl font-semibold">Publishing queue</h2>
            <p className="mt-2 text-sm leading-6 text-[#c7ddcb]">Published items appear in the Expo app immediately.</p>
            <div className="mt-6 grid gap-3">
              {content === undefined && <p className="text-sm text-[#c7ddcb]">Loading content…</p>}
              {content?.map((item) => (
                <article className="rounded-2xl bg-white/10 p-4" key={item._id}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold tracking-[0.12em] text-[#a7d9af]">{item.status.toUpperCase()} · {item.category}</p>
                      <h3 className="mt-2 font-semibold">{item.title}</h3>
                    </div>
                    <span className="shrink-0 text-xs text-[#c7ddcb]">{item.readMinutes} min</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#173e27]" onClick={() => publish({ id: item._id, publish: item.status !== "published" })}>
                      {item.status === "published" ? "Unpublish" : "Publish"}
                    </button>
                    <button className="rounded-full border border-white/30 px-3 py-1.5 text-xs font-bold" onClick={() => remove({ id: item._id })}>Delete</button>
                  </div>
                </article>
              ))}
              {content?.length === 0 && <p className="rounded-2xl border border-dashed border-white/30 p-5 text-sm text-[#c7ddcb]">Your drafts and published education will appear here.</p>}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
