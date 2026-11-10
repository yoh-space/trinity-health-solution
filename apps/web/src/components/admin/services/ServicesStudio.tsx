"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { anyApi } from "convex/server";
import {
  Stethoscope,
  Heart,
  Droplets,
  Baby,
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Search,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import {
  ServiceItem,
  ServiceForm,
  emptyServiceForm,
  formFromService,
} from "./types";
import { ServiceEditor } from "./ServiceEditor";
import { EditorDrawer } from "../ui/EditorDrawer";

export function ServicesStudio() {
  const services = useQuery(anyApi.services.listForAdmin) as ServiceItem[] | undefined;

  const createService = useMutation(anyApi.services.create);
  const updateService = useMutation(anyApi.services.update);
  const publishService = useMutation(anyApi.services.publish);
  const removeService = useMutation(anyApi.services.remove);
  const reorderServices = useMutation(anyApi.services.reorder);
  const seedServices = useMutation(anyApi.services.ensureSeedServices);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
  const [editingItem, setEditingItem] = useState<ServiceItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<ServiceForm>(emptyServiceForm);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(""), 4000);
  };

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(""), 5000);
  };

  const handleStartCreate = () => {
    setForm({
      ...emptyServiceForm,
      order: (services?.length ?? 0) + 1,
    });
    setEditingItem(null);
    setIsCreating(true);
  };

  const handleStartEdit = (item: ServiceItem) => {
    setEditingItem(item);
    setForm(formFromService(item));
    setIsCreating(false);
  };

  const handleCancelEditor = () => {
    setEditingItem(null);
    setIsCreating(false);
  };

  const handleFormChange = <K extends keyof ServiceForm>(
    field: K,
    value: ServiceForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage("");

    try {
      if (editingItem) {
        await updateService({
          id: editingItem._id as any,
          ...form,
        });
        showFeedback("Service updated successfully.");
      } else {
        await createService(form);
        showFeedback("New service created in draft mode.");
      }
      handleCancelEditor();
    } catch (err: any) {
      showError(err?.message || "Failed to save service.");
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (item: ServiceItem) => {
    const nextState = item.status !== "published";
    try {
      await publishService({
        id: item._id as any,
        publish: nextState,
      });
      showFeedback(
        nextState
          ? `"${item.categoryEn}" is now published live!`
          : `"${item.categoryEn}" moved to draft.`
      );
    } catch (err: any) {
      showError(err?.message || "Failed to update publish state.");
    }
  };

  const handleDelete = async (item: ServiceItem) => {
    if (!confirm(`Are you sure you want to delete "${item.categoryEn}"?`)) return;
    try {
      await removeService({ id: item._id as any });
      showFeedback("Service deleted.");
    } catch (err: any) {
      showError(err?.message || "Failed to delete service.");
    }
  };

  const handleSeedDefaults = async () => {
    if (!confirm("Populate database with default maternal and infant clinical services?")) return;
    setSeeding(true);
    try {
      const res: any = await seedServices();
      showFeedback(`Seeding complete: ${res?.servicesInserted ?? 0} services inserted.`);
    } catch (err: any) {
      showError(err?.message || "Failed to seed default services.");
    } finally {
      setSeeding(false);
    }
  };

  const handleMoveOrder = async (item: ServiceItem, direction: "up" | "down") => {
    if (!services) return;
    const sorted = [...services].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex((s) => s._id === item._id);
    if (index === -1) return;
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === sorted.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const temp = sorted[index];
    sorted[index] = sorted[targetIndex];
    sorted[targetIndex] = temp;

    try {
      await reorderServices({
        orderedIds: sorted.map((s) => s._id as any),
      });
      showFeedback("Card order updated.");
    } catch (err: any) {
      showError("Failed to update ordering.");
    }
  };

  // Filtered List
  const filteredServices = (services ?? []).filter((s) => {
    const matchesSearch =
      s.categoryEn.toLowerCase().includes(search.toLowerCase()) ||
      s.categoryAm.toLowerCase().includes(search.toLowerCase()) ||
      s.guidelineEn.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || s.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const publishedCount = (services ?? []).filter((s) => s.status === "published").length;
  const draftCount = (services ?? []).filter((s) => s.status === "draft").length;

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "Heart":
        return <Heart size={18} />;
      case "Droplets":
        return <Droplets size={18} />;
      case "Baby":
        return <Baby size={18} />;
      case "Sparkles":
        return <Sparkles size={18} />;
      default:
        return <Stethoscope size={18} />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner / KPIs */}
      <div className="flex flex-col justify-between gap-5 rounded-3xl border border-[#dce6dc] bg-white p-6 shadow-xs sm:flex-row sm:items-center sm:p-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-[#eef6f0] text-[#1c573e]">
              <Stethoscope size={16} />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1c573e]">
              Catalog & Content Studio
            </span>
          </div>
          <h2 className="mt-1 text-2xl font-extrabold text-[#163826]">
            Clinical & Community Services Studio
          </h2>
          <p className="mt-1 text-xs text-[#526a5b]">
            Manage the 4 maternal/child clinical pillars, scopes of care, and MoH/WHO clinical guidelines displayed on the public site.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleSeedDefaults}
            disabled={seeding}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#cbd8cb] bg-white px-3.5 py-2.5 text-xs font-bold text-[#2d4e39] transition hover:bg-[#f6faf6] disabled:opacity-50"
            title="Import official 4 MoH pillars if not already seeded"
          >
            <RefreshCw size={13} className={seeding ? "animate-spin" : ""} />
            <span>Seed Default Services</span>
          </button>
          <button
            onClick={handleStartCreate}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#1c573e] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#154631] active:scale-95"
          >
            <Plus size={14} />
            <span>New Service Pillar</span>
          </button>
          <Link
            href="/services"
            target="_blank"
            className="inline-flex items-center gap-1 rounded-xl border border-[#d2ddd0] bg-[#f8faf6] px-3 py-2.5 text-xs font-semibold text-[#3b5444] transition hover:text-[#1c573e]"
          >
            <span>Live /services</span>
            <ExternalLink size={12} />
          </Link>
        </div>
      </div>

      {/* Notifications */}
      {feedbackMessage && (
        <div className="flex items-center gap-2 rounded-2xl border border-[#bfe3ca] bg-[#eef8f2] p-4 text-xs font-bold text-[#1a5732]">
          <CheckCircle2 size={16} />
          <span>{feedbackMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="flex items-center gap-2 rounded-2xl border border-[#f0c3c3] bg-[#fdf2f2] p-4 text-xs font-bold text-[#a12f2f]">
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Editor Slide-Over Drawer */}
      <EditorDrawer
        open={isCreating || !!editingItem}
        title={editingItem ? `Edit: ${editingItem.categoryEn}` : "New Service Pillar"}
        subtitle={
          editingItem
            ? "Changes are saved to draft until you publish."
            : "Fill in the fields below to add a clinical service card."
        }
        onClose={handleCancelEditor}
      >
        <ServiceEditor
          form={form}
          editing={!!editingItem}
          saving={saving}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
          onCancel={handleCancelEditor}
        />
      </EditorDrawer>

      {/* Overview Stats Strip */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-[#dce6dc] bg-white p-4">
          <p className="text-[11px] font-bold text-[#627768]">Total Service Pillars</p>
          <p className="mt-1 text-2xl font-black text-[#163826]">{services?.length ?? 0}</p>
        </div>
        <div className="rounded-2xl border border-[#bfe3ca] bg-[#f3f9f4] p-4">
          <p className="text-[11px] font-bold text-[#1c573e]">Published Live</p>
          <p className="mt-1 text-2xl font-black text-[#1c573e]">{publishedCount}</p>
        </div>
        <div className="rounded-2xl border border-[#f0dfcc] bg-[#fcf8f3] p-4">
          <p className="text-[11px] font-bold text-[#b45d34]">Draft Mode</p>
          <p className="mt-1 text-2xl font-black text-[#b45d34]">{draftCount}</p>
        </div>
        <div className="rounded-2xl border border-[#dce6dc] bg-white p-4">
          <p className="text-[11px] font-bold text-[#627768]">Public Destination</p>
          <p className="mt-1 text-xs font-bold text-[#1c573e]">/services & Homepage</p>
        </div>
      </div>

      {/* Filters and List */}
      <div className="rounded-3xl border border-[#dce6dc] bg-white p-6 shadow-xs sm:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="relative w-full max-w-sm">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7e9485]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services or clinical guidelines..."
              className="w-full rounded-xl border border-[#cddad0] bg-white py-2 pl-9 pr-3 text-xs font-medium focus:border-[#1c573e] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 rounded-xl bg-[#f0f4ee] p-1 text-xs font-semibold">
            <button
              onClick={() => setFilterStatus("all")}
              className={`rounded-lg px-3 py-1.5 transition ${
                filterStatus === "all"
                  ? "bg-white text-[#1c573e] shadow-xs"
                  : "text-[#587061] hover:text-[#1c573e]"
              }`}
            >
              All ({services?.length ?? 0})
            </button>
            <button
              onClick={() => setFilterStatus("published")}
              className={`rounded-lg px-3 py-1.5 transition ${
                filterStatus === "published"
                  ? "bg-white text-[#1c573e] shadow-xs"
                  : "text-[#587061] hover:text-[#1c573e]"
              }`}
            >
              Published ({publishedCount})
            </button>
            <button
              onClick={() => setFilterStatus("draft")}
              className={`rounded-lg px-3 py-1.5 transition ${
                filterStatus === "draft"
                  ? "bg-white text-[#1c573e] shadow-xs"
                  : "text-[#587061] hover:text-[#1c573e]"
              }`}
            >
              Drafts ({draftCount})
            </button>
          </div>
        </div>

        {/* Services List */}
        <div className="mt-6 space-y-4">
          {filteredServices.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#ccd9cd] py-12 text-center">
              <Stethoscope size={28} className="mx-auto text-[#8ea394]" />
              <p className="mt-2 text-xs font-bold text-[#455c4c]">No service cards found</p>
              <p className="mt-1 text-[11px] text-[#788c7d]">
                Click "Seed Default Services" or "New Service Pillar" to add clinical content.
              </p>
            </div>
          ) : (
            filteredServices.map((item, index) => {
              const isActive = editingItem?._id === item._id;
              return (
                <div
                  key={item._id}
                  className={`rounded-2xl border p-4 shadow-2xs transition ${
                    isActive
                      ? "border-[#1c573e] bg-[#f4fbf6] ring-2 ring-[#1c573e]/20"
                      : "border-[#e1eae1] bg-white hover:border-[#b8cfba]"
                  }`}
                >
                  {/* Top row: order + icon + details */}
                  <div className="flex items-start gap-3">
                    {/* Order Arrows */}
                    <div className="flex shrink-0 flex-col items-center gap-0.5 pt-1 text-[#7a8f81]">
                      <button
                        onClick={() => handleMoveOrder(item, "up")}
                        disabled={index === 0}
                        className="rounded p-0.5 hover:bg-[#eaf1e8] disabled:opacity-30"
                        title="Move up"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <span className="text-[10px] font-black text-[#1c573e]">{item.order}</span>
                      <button
                        onClick={() => handleMoveOrder(item, "down")}
                        disabled={index === filteredServices.length - 1}
                        className="rounded p-0.5 hover:bg-[#eaf1e8] disabled:opacity-30"
                        title="Move down"
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>

                    {/* Icon */}
                    <div
                      className={`flex size-11 shrink-0 items-center justify-center rounded-xl border ${item.accent}`}
                    >
                      {renderIcon(item.icon)}
                    </div>

                    {/* Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="rounded-full bg-[#f0f4ee] px-2 py-0.5 text-[10px] font-bold text-[#1c573e]">
                          {item.badgeEn}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            item.status === "published"
                              ? "bg-[#eaf5ee] text-[#1a5f36]"
                              : "bg-[#fdf2e8] text-[#974d1a]"
                          }`}
                        >
                          {item.status === "published" ? "● Published" : "○ Draft"}
                        </span>
                        <span className="text-[11px] text-[#86998b]">slug: {item.slug}</span>
                        {isActive && (
                          <span className="rounded-full bg-[#1c573e] px-2 py-0.5 text-[10px] font-bold text-white">
                            Editing
                          </span>
                        )}
                      </div>

                      <h4 className="mt-1 truncate text-sm font-extrabold text-[#173827]">
                        {item.categoryEn}
                        <span className="ml-1.5 font-normal text-[#718a7a]">({item.categoryAm})</span>
                      </h4>

                      <p className="mt-0.5 line-clamp-1 text-xs text-[#526658]">{item.taglineEn}</p>

                      <p className="mt-0.5 text-[11px] text-[#8ea394]">
                        {item.deliverablesEn?.length ?? 0} deliverables
                        {item.guidelineEn ? ` · ${item.guidelineEn}` : ""}
                      </p>
                    </div>
                  </div>

                  {/* Action bar */}
                  <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[#edf2ed] pt-3">
                    {/* Primary: Edit */}
                    <button
                      onClick={() => handleStartEdit(item)}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                        isActive
                          ? "bg-[#1c573e] text-white shadow-sm"
                          : "border border-[#b8d4be] bg-white text-[#1c573e] hover:bg-[#eef6f0]"
                      }`}
                    >
                      <Edit2 size={13} />
                      <span>{isActive ? "Currently Editing" : "Edit Details"}</span>
                    </button>

                    {/* Divider */}
                    <span className="h-5 w-px bg-[#dce6dc]" />

                    {/* Publish toggle */}
                    <button
                      onClick={() => handleTogglePublish(item)}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                        item.status === "published"
                          ? "border border-[#ccdacc] bg-white text-[#455c4d] hover:bg-[#f6f8f5]"
                          : "border border-[#b6d4c0] bg-[#eef6f0] text-[#1c573e] hover:bg-[#ddf0e5]"
                      }`}
                    >
                      {item.status === "published" ? (
                        <><EyeOff size={13} /><span>Unpublish</span></>
                      ) : (
                        <><Eye size={13} /><span>Publish</span></>
                      )}
                    </button>

                    {/* Delete — danger, pushed to the right */}
                    <button
                      onClick={() => handleDelete(item)}
                      className="ml-auto inline-flex items-center gap-1.5 rounded-xl border border-transparent px-2.5 py-2 text-[#97a69b] transition hover:border-[#f0c3c3] hover:bg-[#fbeaea] hover:text-[#b43d3d]"
                      title="Delete service"
                    >
                      <Trash2 size={14} />
                      <span className="text-xs font-semibold">Delete</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
