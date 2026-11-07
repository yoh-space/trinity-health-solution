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
import { ServicesStudio } from "@/components/admin/services/ServicesStudio";
import { ProductsStudio } from "@/components/admin/products/ProductsStudio";

type BoundedCount = number | "100+";

function sumCounts(...counts: BoundedCount[]): BoundedCount {
  if (counts.some((count) => count === "100+")) return "100+";
  let total = 0;
  for (const count of counts) {
    if (count !== "100+") total += count;
  }
  return total;
}

function chartCount(count: BoundedCount): number {
  return count === "100+" ? 100 : count;
}

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
          clinical: { submitted: BoundedCount; inReview: BoundedCount; contacted: BoundedCount; closed: BoundedCount };
          counselling: { submitted: BoundedCount; inReview: BoundedCount; contacted: BoundedCount; closed: BoundedCount };
        };
      }
    | undefined;

  const [now] = useState(() => Date.now());
  const teamPaginationArgs = useMemo(
    () => ({
      paginationOpts: { numItems: 100, cursor: null },
      includeInactive: true,
    }),
    []
  );

  const teamPage = useQuery(
    anyApi.staff.listTeamMembers,
    teamPaginationArgs
  ) as { page: TeamMemberItem[] } | undefined;

  const adminQueueArgs = useMemo(
    () => ({
      requestType: "all" as const,
      status: "all" as const,
      paginationOpts: { numItems: 25, cursor: null },
    }),
    []
  );
  const adminQueuePage = useQuery(
    anyApi.careRequests.listAdminQueuePage,
    adminQueueArgs
  ) as
    | {
        page: Array<{
          _id: string;
          requestType: "clinical" | "counselling";
          status: "submitted" | "inReview" | "contacted" | "closed";
          contactMethod: "email" | "phone";
          contactDetails: string;
          requestSummary?: string;
          createdAt: number;
          assignedToProfileId?: string;
          assignedToName?: string;
        }>;
      }
    | undefined;

  const upcomingAppointments = useQuery(
    anyApi.appointments.listUpcomingForAdmin,
    useMemo(() => ({ now }), [now])
  ) as AppointmentItem[] | undefined;

  // Content Mutations
  const create = useMutation(anyApi.education.create);
  const update = useMutation(anyApi.education.update);
  const publish = useMutation(anyApi.education.publish);
  const remove = useMutation(anyApi.education.remove);
  const ensureSeedContent = useMutation(anyApi.education.ensureSeedContent);

  // Content Local State
  const [form, setForm] = useState<EducationForm>(emptyEducationForm);
  const [editingItem, setEditingItem] = useState<EducationItem | null>(null);
  const [previewItem, setPreviewItem] = useState<EducationItem | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "draft" | "published">("all");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

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

  const effectiveRequests: CareRequestItem[] = (adminQueuePage?.page ?? []).map(
    (request) => ({
      _id: request._id,
      requestType: request.requestType,
      status: request.status,
      contactMethod: request.contactMethod,
      contactDetails: request.contactDetails,
      requestSummary: request.requestSummary,
      assignedTo: request.assignedToProfileId,
      assignedStaffName: request.assignedToName,
      createdAt: request.createdAt,
    }),
  );

  // Aggregate KPI Metrics
  const kpiData = useMemo(() => {
    if (
      !adminOverview ||
      !teamPage ||
      content === undefined ||
      upcomingAppointments === undefined
    ) {
      return null;
    }

    const clinCounts = adminOverview?.counts.clinical;
    const counCounts = adminOverview?.counts.counselling;

    const totalClin = sumCounts(
      clinCounts.submitted,
      clinCounts.inReview,
      clinCounts.contacted,
      clinCounts.closed,
    );
    const totalCoun = sumCounts(
      counCounts.submitted,
      counCounts.inReview,
      counCounts.contacted,
      counCounts.closed,
    );

    const activeStaff = effectiveTeam.filter((m) => m.active).length;
    const availableStaff = effectiveTeam.filter((m) => m.active && m.availability === "available").length;
    const clinicians = effectiveTeam.filter((m) => m.role === "clinician").length;
    const counselors = effectiveTeam.filter((m) => m.role === "counselor").length;

    const publishedNotes = content.filter((item) => item.status === "published").length;
    const draftNotes = content.filter((item) => item.status === "draft").length;

    const onlineAppts = effectiveAppointments.filter((a) => a.format === "online").length;

    return {
      totalCareRequests: sumCounts(totalClin, totalCoun),
      clinicalRequests: totalClin,
      counsellingRequests: totalCoun,
      submittedBacklog: sumCounts(clinCounts.submitted, counCounts.submitted),
      activeStaffCount: activeStaff,
      availableStaffCount: availableStaff,
      clinicianCount: clinicians,
      counselorCount: counselors,
      publishedNotesCount: publishedNotes,
      draftNotesCount: draftNotes,
      upcomingAppointmentsCount: effectiveAppointments.length,
      onlineAppointmentsCount: onlineAppts,
    };
  }, [adminOverview, teamPage, effectiveTeam, content, upcomingAppointments, effectiveAppointments]);

  // Content Category Distribution Breakdown
  const contentCategoryDistribution = useMemo(() => {
    const categories = [...new Set((content ?? []).map((item) => item.category.trim()).filter(Boolean))];
    return categories.map((category) => {
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
    () => adminOverview && ({
      clinical: {
        submitted: chartCount(adminOverview.counts.clinical.submitted),
        inReview: chartCount(adminOverview.counts.clinical.inReview),
        contacted: chartCount(adminOverview.counts.clinical.contacted),
        closed: chartCount(adminOverview.counts.clinical.closed),
      },
      counselling: {
        submitted: chartCount(adminOverview.counts.counselling.submitted),
        inReview: chartCount(adminOverview.counts.counselling.inReview),
        contacted: chartCount(adminOverview.counts.counselling.contacted),
        closed: chartCount(adminOverview.counts.counselling.closed),
      },
    }),
    [adminOverview]
  );

  const chartStaffDistribution = useMemo(() => {
    const clinicians = effectiveTeam.filter((member) => member.role === "clinician" && member.active);
    const counselors = effectiveTeam.filter((member) => member.role === "counselor" && member.active);
    const admins = effectiveTeam.filter((member) => member.role === "admin" && member.active);
    const caseload = (members: TeamMemberItem[]) =>
      members.reduce(
        (total, member) => total + (member.openRequestCount === "100+" ? 100 : member.openRequestCount),
        0,
      );

    return {
      clinicians: {
        active: clinicians.length,
        available: clinicians.filter((m) => m.availability === "available").length,
        caseload: caseload(clinicians),
      },
      counselors: {
        active: counselors.length,
        available: counselors.filter((m) => m.availability === "available").length,
        caseload: caseload(counselors),
      },
      admins: {
        active: admins.length,
        available: admins.filter((m) => m.availability === "available").length,
        caseload: caseload(admins),
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

  async function seedContent() {
    setSeeding(true);
    setMessage("");
    setError("");
    try {
      const result = await ensureSeedContent();
      setMessage(
        `${result.inserted + result.legacyLinked} starter notes are now available.`,
      );
    } catch (value) {
      setError(
        value instanceof Error
          ? value.message
          : "Unable to load the starter learning library.",
      );
    } finally {
      setSeeding(false);
    }
  }

  return (
    <AdminShell activeTab={activeTab} onTabChange={setActiveTab}>
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
            {kpiData && (
              <section className="mb-8">
                <AdminKpiOverview data={kpiData} />
              </section>
            )}

            <div className="space-y-8">
              {kpiData && chartRequestCounts ? (
                <AdminCharts
                  requestStatusCounts={chartRequestCounts}
                  staffDistribution={chartStaffDistribution}
                  appointmentFormatSplit={chartAppointmentSplit}
                  contentCategoryDistribution={contentCategoryDistribution}
                />
              ) : (
                <p className="text-sm text-[#657a6b]">Loading dashboard data...</p>
              )}

              {/* Quick Triage Stream in Overview */}
              <div className="mt-8">
                {adminQueuePage ? (
                  <AdminTriageQueue
                    requests={effectiveRequests.slice(0, 5)}
                    staffList={effectiveTeam}
                  />
                ) : (
                  <p className="text-sm text-[#657a6b]">Loading care requests...</p>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === "triage" &&
          (adminQueuePage ? (
            <AdminTriageQueue
              requests={effectiveRequests}
              staffList={effectiveTeam}
            />
          ) : (
            <p className="text-sm text-[#657a6b]">Loading care requests...</p>
          ))}

        {activeTab === "roster" && (
          <AdminStaffRoster teamMembers={effectiveTeam} />
        )}

        {activeTab === "services-studio" && (
          <ServicesStudio />
        )}

        {activeTab === "products-studio" && (
          <ProductsStudio />
        )}

        {activeTab === "curriculum" && (
          <div className="space-y-5">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={startNew}
                className="flex items-center gap-2 rounded-full bg-[#1c573e] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#154631] active:scale-95"
              >
                <Plus size={15} />
                <span>New Curriculum Note</span>
              </button>
            </div>
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
                onSeed={seedContent}
                seeding={seeding}
              />
            </div>
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
