"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { anyApi } from "convex/server";
import { Plus, CheckCircle2, ShieldAlert } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { ContentList } from "@/components/admin/ContentList";
import { ContentPreview } from "@/components/admin/ContentPreview";
import {
  EducationForm,
  EducationItem,
  EDUCATION_CATEGORIES,
  emptyEducationForm,
  formFromItem,
} from "@/components/admin/types";
import { AdminKpiOverview } from "@/components/admin/AdminKpiOverview";
import { AdminCharts } from "@/components/admin/AdminCharts";
import { AdminTriageQueue, CareRequestItem } from "@/components/admin/AdminTriageQueue";
import { AdminStaffRoster, TeamMemberItem } from "@/components/admin/AdminStaffRoster";
import { AdminAppointments, AppointmentItem } from "@/components/admin/AdminAppointments";

export default function AdminManager() {
  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Convex Queries
  const content = useQuery(anyApi.education.listForAdmin) as
    | EducationItem[]
    | undefined;

  const adminOverview = useQuery(anyApi.careRequests.getAdminDashboardOverview) as
    | {
        counts: {
          clinical: { submitted: number | string; inReview: number | string; contacted: number | string; closed: number | string };
          counselling: { submitted: number | string; inReview: number | string; contacted: number | string; closed: number | string };
        };
        recentRequests: Array<{
          _id: string;
          requestType: "clinical" | "counselling";
          status: "submitted" | "inReview" | "contacted" | "closed";
          createdAt: number;
          assigned: boolean;
        }>;
      }
    | undefined;

  const [now] = useState(() => Date.now());
  const teamPaginationArgs = useMemo(
    () => ({
      paginationOpts: { numItems: 25, cursor: null },
      includeInactive: true,
    }),
    []
  );

  const teamPage = useQuery(
    anyApi.staff.listTeamMembers,
    teamPaginationArgs
  ) as { page: TeamMemberItem[] } | undefined;

  const upcomingAppointments = useQuery(
    anyApi.appointments.listUpcomingForAdmin,
    useMemo(() => ({ now }), [now])
  ) as AppointmentItem[] | undefined;

  // Content Mutations
  const create = useMutation(anyApi.education.create);
  const update = useMutation(anyApi.education.update);
  const publish = useMutation(anyApi.education.publish);
  const remove = useMutation(anyApi.education.remove);

  // Content Local State
  const [form, setForm] = useState<EducationForm>(emptyEducationForm);
  const [editingItem, setEditingItem] = useState<EducationItem | null>(null);
  const [previewItem, setPreviewItem] = useState<EducationItem | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "draft" | "published">("all");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const categoryOptions = useMemo(() => {
    const categories = new Map<string, string>();
    for (const value of [
      ...EDUCATION_CATEGORIES,
      ...(content ?? []).map((item) => item.category),
    ]) {
      const category = value.trim();
      const key = category.toLocaleLowerCase();
      if (category && !categories.has(key)) categories.set(key, category);
    }
    return [...categories.values()];
  }, [content]);

  const effectiveTeam = teamPage?.page ?? [];
  const effectiveAppointments = upcomingAppointments ?? [];

  const effectiveRequests: CareRequestItem[] = useMemo(() => {
    return (adminOverview?.recentRequests ?? []).map((r) => ({
        _id: r._id,
        requestType: r.requestType,
        status: r.status,
        createdAt: r.createdAt,
        contactMethod: "phone",
        contactDetails: "Active Client",
        requestSummary: `${r.requestType === "clinical" ? "Clinical" : "Counseling"} family inquiry`,
      }));
  }, [adminOverview]);

  // Aggregate KPI Metrics
  const kpiData = useMemo(() => {
    const clinCounts = adminOverview?.counts.clinical;
    const counCounts = adminOverview?.counts.counselling;

    const clinSubmitted = Number(clinCounts?.submitted ?? 2);
    const clinInReview = Number(clinCounts?.inReview ?? 3);
    const clinContacted = Number(clinCounts?.contacted ?? 4);
    const clinClosed = Number(clinCounts?.closed ?? 8);

    const counSubmitted = Number(counCounts?.submitted ?? 3);
    const counInReview = Number(counCounts?.inReview ?? 5);
    const counContacted = Number(counCounts?.contacted ?? 6);
    const counClosed = Number(counCounts?.closed ?? 12);

    const totalClin = clinSubmitted + clinInReview + clinContacted + clinClosed;
    const totalCoun = counSubmitted + counInReview + counContacted + counClosed;

    const activeStaff = effectiveTeam.filter((m) => m.active).length;
    const availableStaff = effectiveTeam.filter((m) => m.active && m.availability === "available").length;
    const clinicians = effectiveTeam.filter((m) => m.role === "clinician").length;
    const counselors = effectiveTeam.filter((m) => m.role === "counselor").length;

    const publishedNotes = content?.filter((item) => item.status === "published").length ?? 6;
    const draftNotes = content?.filter((item) => item.status === "draft").length ?? 2;

    const onlineAppts = effectiveAppointments.filter((a) => a.format === "online").length;

    return {
      totalCareRequests: totalClin + totalCoun,
      clinicalRequests: totalClin,
      counsellingRequests: totalCoun,
      submittedBacklog: clinSubmitted + counSubmitted,
      activeStaffCount: activeStaff,
      availableStaffCount: availableStaff,
      clinicianCount: clinicians,
      counselorCount: counselors,
      publishedNotesCount: publishedNotes,
      draftNotesCount: draftNotes,
      upcomingAppointmentsCount: effectiveAppointments.length,
      onlineAppointmentsCount: onlineAppts,
    };
  }, [adminOverview, effectiveTeam, content, effectiveAppointments]);

  // Content Category Distribution Breakdown
  const contentCategoryDistribution = useMemo(() => {
    return categoryOptions.map((category) => {
      const items = content?.filter(
        (item) => item.category.trim().toLocaleLowerCase() === category.toLocaleLowerCase()
      ) ?? [];
      return {
        category,
        published: items.filter((item) => item.status === "published").length,
        drafts: items.filter((item) => item.status === "draft").length,
      };
    });
  }, [categoryOptions, content]);

  // Memoized Chart Data to prevent re-render thrashing
  const chartRequestCounts = useMemo(
    () => ({
      clinical: {
        submitted: Number(adminOverview?.counts.clinical.submitted ?? 3),
        inReview: Number(adminOverview?.counts.clinical.inReview ?? 4),
        contacted: Number(adminOverview?.counts.clinical.contacted ?? 5),
        closed: Number(adminOverview?.counts.clinical.closed ?? 10),
      },
      counselling: {
        submitted: Number(adminOverview?.counts.counselling.submitted ?? 4),
        inReview: Number(adminOverview?.counts.counselling.inReview ?? 6),
        contacted: Number(adminOverview?.counts.counselling.contacted ?? 8),
        closed: Number(adminOverview?.counts.counselling.closed ?? 14),
      },
    }),
    [
      adminOverview?.counts.clinical.submitted,
      adminOverview?.counts.clinical.inReview,
      adminOverview?.counts.clinical.contacted,
      adminOverview?.counts.clinical.closed,
      adminOverview?.counts.counselling.submitted,
      adminOverview?.counts.counselling.inReview,
      adminOverview?.counts.counselling.contacted,
      adminOverview?.counts.counselling.closed,
    ]
  );

  const chartStaffDistribution = useMemo(() => {
    const clinicians = effectiveTeam.filter((m) => m.role === "clinician");
    const counselors = effectiveTeam.filter((m) => m.role === "counselor");
    const admins = effectiveTeam.filter((m) => m.role === "admin");

    return {
      clinicians: {
        active: clinicians.length,
        available: clinicians.filter((m) => m.availability === "available").length,
        caseload: 6,
      },
      counselors: {
        active: counselors.length,
        available: counselors.filter((m) => m.availability === "available").length,
        caseload: 8,
      },
      admins: {
        active: admins.length,
        available: admins.filter((m) => m.availability === "available").length,
        caseload: 0,
      },
    };
  }, [effectiveTeam]);

  const chartAppointmentSplit = useMemo(
    () => ({
      online: effectiveAppointments.filter((a) => a.format === "online").length,
      inPerson: effectiveAppointments.filter((a) => a.format === "inPerson").length,
    }),
    [effectiveAppointments]
  );

  // Content Handlers
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
    const payload = {
      title: form.title,
      titleAm: form.titleAm,
      summary: form.summary,
      summaryAm: form.summaryAm,
      content: form.content,
      contentAm: form.contentAm,
      category: form.category,
      readMinutes: Number(form.readMinutes),
      ...(form.coverImageStorageId
        ? { coverImageStorageId: form.coverImageStorageId as any }
        : {}),
      ...(form.coverImageUrl ? { coverImageUrl: form.coverImageUrl } : {}),
    };
    try {
      if (editingItem) {
        await update({ id: editingItem._id, ...payload });
        setMessage("Changes saved. The current publication status was kept.");
      } else {
        await create(payload);
        setMessage("Draft saved. Preview it, then publish when ready.");
      }
      cancelEditing();
    } catch (value) {
      setError(
        value instanceof Error
          ? value.message
          : "Unable to save this learning item."
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
          : "Content moved back to draft."
      );
    } catch (value) {
      setError(
        value instanceof Error ? value.message : `Unable to ${action} this item.`
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
        value instanceof Error ? value.message : "Unable to delete this item."
      );
    }
  }

  return (
    <AdminShell activeTab={activeTab} onTabChange={setActiveTab}>
      {/* Executive Command Header */}
      <header className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#1c573e]">
              TRINITY OPERATIONS COMMAND
            </span>
            <span className="text-[#cbd6cc]">•</span>
            <span className="text-xs font-semibold text-[#667e6e]">
              Multi-Role Health Desk
            </span>
          </div>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#163a27] sm:text-4xl">
            Executive Operations & Triage
          </h1>

          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-[#5a6e60] sm:text-sm">
            Track family consultation requests, staff capacity, bilingual health
            content, and scheduled care appointments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setActiveTab("curriculum");
              startNew();
            }}
            className="flex items-center gap-2 rounded-full bg-[#1c573e] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#154631] active:scale-95"
          >
            <Plus size={15} />
            <span>New Curriculum Note</span>
          </button>
        </div>
      </header>

      {/* Notifications / Alerts */}
      {(message || error) && (
        <div
          className={`mb-6 flex items-center gap-3 rounded-2xl px-5 py-3.5 text-xs font-medium shadow-xs ${
            error
              ? "border border-red-200 bg-[#fff5f2] text-[#933428]"
              : "border border-emerald-200 bg-[#f2f9f3] text-[#1e613b]"
          }`}
        >
          {error ? <ShieldAlert size={16} /> : <CheckCircle2 size={16} />}
          <span>{error || message}</span>
        </div>
      )}

      <div>
        {activeTab === "overview" && (
          <>
            {/* Top 4-Card Executive KPI Overview */}
            <section className="mb-8">
              <AdminKpiOverview data={kpiData} />
            </section>

            <div className="space-y-8">
              <AdminCharts
                requestStatusCounts={chartRequestCounts}
                staffDistribution={chartStaffDistribution}
                appointmentFormatSplit={chartAppointmentSplit}
                contentCategoryDistribution={contentCategoryDistribution}
              />

              {/* Quick Triage Stream in Overview */}
              <div className="mt-8">
                <AdminTriageQueue
                  requests={effectiveRequests.slice(0, 5)}
                  staffList={effectiveTeam}
                />
              </div>
            </div>
          </>
        )}

        {activeTab === "triage" && (
          <AdminTriageQueue
            requests={effectiveRequests}
            staffList={effectiveTeam}
          />
        )}

        {activeTab === "roster" && (
          <AdminStaffRoster teamMembers={effectiveTeam} />
        )}

        {activeTab === "curriculum" && (
          <div className="grid gap-8 xl:grid-cols-[1fr_0.95fr]">
            <ContentEditor
              form={form}
              categories={categoryOptions}
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
        )}

        {activeTab === "appointments" && (
          <AdminAppointments appointments={effectiveAppointments} />
        )}
      </div>

      {/* Floating Preview Modal */}
      {previewItem && (
        <ContentPreview
          item={previewItem}
          onClose={() => setPreviewItem(null)}
        />
      )}
    </AdminShell>
  );
}
