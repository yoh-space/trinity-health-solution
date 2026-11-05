"use client";

import { EducationItem } from "./types";

type Props = {
  items: EducationItem[] | undefined;
  search: string;
  status: "all" | "draft" | "published";
  onSearch: (value: string) => void;
  onStatus: (value: "all" | "draft" | "published") => void;
  onEdit: (item: EducationItem) => void;
  onPreview: (item: EducationItem) => void;
  onPublish: (item: EducationItem) => void;
  onRemove: (item: EducationItem) => void;
  onSeed: () => void;
  seeding: boolean;
};

export function ContentList({
  items,
  search,
  status,
  onSearch,
  onStatus,
  onEdit,
  onPreview,
  onPublish,
  onRemove,
  onSeed,
  seeding,
}: Props) {
  const filtered = items?.filter((item) => {
    const matchesStatus = status === "all" || item.status === status;
    const query = search.trim().toLocaleLowerCase();
    const matchesQuery =
      !query ||
      `${item.title} ${item.titleAm} ${item.category}`
        .toLocaleLowerCase()
        .includes(query);
    return matchesStatus && matchesQuery;
  });

  return (
    <section className="rounded-3xl bg-[#173e27] p-6 text-white shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a7d9af]">
            CONTENT LIBRARY
          </p>
          <h2 className="mt-2 text-2xl font-semibold">Publishing queue</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#c7ddcb]">
            Preview, refine, and publish bilingual notes for families across web
            and mobile.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSeed}
            disabled={seeding}
            className="rounded-full border border-white/30 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/10 disabled:opacity-50"
          >
            {seeding ? "Loading..." : "Load starter library"}
          </button>
          <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-[#c7ddcb]">
            {items?.length ?? 0} total
          </span>
        </div>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
        <input
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Search title or category"
          className="rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white outline-none placeholder:text-[#b7cdbc] focus:border-[#a7d9af]"
        />
        <div className="flex rounded-xl border border-white/20 p-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => onStatus("all")}
            className={`rounded-lg px-3 py-2 ${status === "all" ? "bg-white text-[#173e27]" : "text-[#c7ddcb]"}`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => onStatus("draft")}
            className={`rounded-lg px-3 py-2 ${status === "draft" ? "bg-white text-[#173e27]" : "text-[#c7ddcb]"}`}
          >
            Drafts
          </button>
          <button
            type="button"
            onClick={() => onStatus("published")}
            className={`rounded-lg px-3 py-2 ${status === "published" ? "bg-white text-[#173e27]" : "text-[#c7ddcb]"}`}
          >
            Live
          </button>
        </div>
      </div>
      <div className="mt-6 grid gap-3">
        {items === undefined && (
          <p className="text-sm text-[#c7ddcb]">Loading content…</p>
        )}
        {filtered?.map((item) => (
          <article className="rounded-2xl bg-white/10 p-4 transition hover:bg-white/[0.14]" key={item._id}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                {item.coverImageUrl ? (
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-xl border border-white/20 bg-black/20">
                    <img
                      src={item.coverImageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="grid size-14 shrink-0 place-items-center rounded-xl bg-white/10 text-xs font-bold text-[#a7d9af]">
                    NOTE
                  </div>
                )}
                <div>
                  <p className="text-[11px] font-bold tracking-[0.12em] text-[#a7d9af]">
                    {item.status.toUpperCase()} · {item.category}
                  </p>
                  <h3 className="mt-1 font-bold text-sm text-white">{item.title}</h3>
                  <p className="mt-0.5 text-xs text-[#c7ddcb]">{item.titleAm}</p>
                </div>
              </div>
              <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-[#c7ddcb]">
                {item.readMinutes} min
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => onEdit(item)}
                className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#173e27]"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onPreview(item)}
                className="rounded-full border border-white/30 px-3 py-1.5 text-xs font-bold"
              >
                Preview
              </button>
              <button
                type="button"
                onClick={() => onPublish(item)}
                className="rounded-full border border-white/30 px-3 py-1.5 text-xs font-bold"
              >
                {item.status === "published" ? "Unpublish" : "Publish"}
              </button>
              <button
                type="button"
                onClick={() => onRemove(item)}
                className="rounded-full border border-[#f0b6a8]/50 px-3 py-1.5 text-xs font-bold text-[#ffd2c8]"
              >
                Delete
              </button>
            </div>
          </article>
        ))}
        {filtered?.length === 0 && (
          <p className="rounded-2xl border border-dashed border-white/30 p-5 text-sm text-[#c7ddcb]">
            No content matches this filter.
          </p>
        )}
      </div>
    </section>
  );
}
