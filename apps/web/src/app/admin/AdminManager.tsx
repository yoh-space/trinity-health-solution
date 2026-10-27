"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { anyApi } from "convex/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { ContentList } from "@/components/admin/ContentList";
import { ContentPreview } from "@/components/admin/ContentPreview";
import {
  EducationForm,
  EducationItem,
  emptyEducationForm,
  formFromItem,
} from "@/components/admin/types";

export default function AdminManager() {
  const content = useQuery(anyApi.education.listForAdmin) as
    | EducationItem[]
    | undefined;
  const create = useMutation(anyApi.education.create);
  const update = useMutation(anyApi.education.update);
  const publish = useMutation(anyApi.education.publish);
  const remove = useMutation(anyApi.education.remove);
  const [form, setForm] = useState<EducationForm>(emptyEducationForm);
  const [editingItem, setEditingItem] = useState<EducationItem | null>(null);
  const [previewItem, setPreviewItem] = useState<EducationItem | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "draft" | "published">("all");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const counts = useMemo(
    () => ({
      total: content?.length ?? 0,
      drafts: content?.filter((item) => item.status === "draft").length ?? 0,
      published:
        content?.filter((item) => item.status === "published").length ?? 0,
    }),
    [content],
  );

  function startNew() {
    setEditingItem(null);
    setForm(emptyEducationForm);
    setMessage("");
    setError("");
  }

  function startEditing(item: EducationItem) {
    setEditingItem(item);
    setForm(formFromItem(item));
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEditing() {
    setEditingItem(null);
    setForm(emptyEducationForm);
  }

  function setField(field: keyof EducationForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    const payload = { ...form, readMinutes: Number(form.readMinutes) };
    try {
      if (editingItem) {
        await update({ id: editingItem._id, ...payload });
        setMessage("Changes saved. The current publication status was kept.");
      } else {
        await create(payload);
        setMessage(
          "Draft saved. Preview it, then publish when it is ready for families.",
        );
      }
      cancelEditing();
    } catch (value) {
      setError(
        value instanceof Error
          ? value.message
          : "Unable to save this learning item.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(item: EducationItem) {
    const nextPublished = item.status !== "published";
    const action = nextPublished ? "publish" : "unpublish";
    if (!window.confirm(`Are you sure you want to ${action} “${item.title}”?`))
      return;
    setMessage("");
    setError("");
    try {
      await publish({ id: item._id, publish: nextPublished });
      setMessage(
        nextPublished
          ? "Content published to web and mobile."
          : "Content moved back to draft.",
      );
    } catch (value) {
      setError(
        value instanceof Error
          ? value.message
          : `Unable to ${action} this item.`,
      );
    }
  }

  async function deleteItem(item: EducationItem) {
    if (!window.confirm(`Delete “${item.title}”? This cannot be undone.`))
      return;
    setMessage("");
    setError("");
    try {
      await remove({ id: item._id });
      if (editingItem?._id === item._id) cancelEditing();
      setMessage("Learning item deleted.");
    } catch (value) {
      setError(
        value instanceof Error ? value.message : "Unable to delete this item.",
      );
    }
  }

  return (
    <AdminShell>
      <header className="mb-10 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-[#438451]">
            TRINITY PUBLISHER
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Family learning library
          </h1>
          <p className="mt-3 max-w-2xl leading-7 text-[#5c6b62]">
            Create, review, and publish bilingual, non-clinical learning for
            families across the Trinity web and mobile apps.
          </p>
        </div>
        <button
          type="button"
          onClick={startNew}
          className="rounded-full bg-[#287343] px-5 py-3 text-sm font-bold text-white"
        >
          + New learning note
        </button>
      </header>
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Stat label="All content" value={counts.total} />
        <Stat label="Drafts" value={counts.drafts} />
        <Stat label="Published" value={counts.published} />
      </div>
      {(message || error) && (
        <div
          className={`mb-6 rounded-2xl px-4 py-3 text-sm ${error ? "bg-[#fff0ed] text-[#8b4437]" : "bg-[#eaf4eb] text-[#245c32]"}`}
        >
          {error || message}
        </div>
      )}
      <div className="grid gap-8 xl:grid-cols-[1fr_0.95fr]">
        <ContentEditor
          form={form}
          editing={Boolean(editingItem)}
          saving={saving}
          onChange={setField}
          onSubmit={save}
          onCancel={cancelEditing}
        />
        <ContentList
          items={content}
          search={search}
          status={status}
          onSearch={setSearch}
          onStatus={setStatus}
          onEdit={startEditing}
          onPreview={setPreviewItem}
          onPublish={togglePublished}
          onRemove={deleteItem}
        />
      </div>
      {previewItem && (
        <ContentPreview
          item={previewItem}
          onClose={() => setPreviewItem(null)}
        />
      )}
    </AdminShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-[#dce8de] bg-white px-5 py-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#718075]">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-[#287343]">{value}</p>
    </div>
  );
}
