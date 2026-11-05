"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { usePaginatedQuery, useQuery } from "convex/react";
import { anyApi } from "convex/server";
import { AppointmentDayCalendar } from "@/components/appointments/AppointmentDayCalendar";

type StaffRole = "admin" | "clinician" | "counselor";
type RequestStatus = "submitted" | "inReview" | "contacted" | "closed";
type QueueStatus = RequestStatus | "all";

interface StaffRequest {
  _id: string;
  requestType: "clinical" | "counselling";
  status: RequestStatus;
  requestSummary?: string;
  createdAt: number;
  assignedToMe?: boolean;
  assignedElsewhere?: boolean;
  assignedToProfileId?: string;
  assignedToName?: string;
}

interface StaffAppointment {
  _id: string;
  requestId: string;
  requestType: "clinical" | "counselling";
  requestSummary?: string;
  scheduledAt: number;
  durationMinutes: number;
  format: "online" | "inPerson";
  staffName?: string;
}

const statuses: RequestStatus[] = ["submitted", "inReview", "contacted", "closed"];

function useStaffRole(): { isLoaded: boolean; role: StaffRole | null } {
  const { user, isLoaded } = useUser();
  const metadataRole = user?.publicMetadata?.role;
  const role: StaffRole | null =
    metadataRole === "admin"
      ? "admin"
      : metadataRole === "clinician" || metadataRole === "counselor"
        ? metadataRole
        : null;
  return { isLoaded, role };
}

function useRoleQueue(role: StaffRole | null, status: QueueStatus, initialNumItems = 25) {
  const selectedStatus = status === "all" ? "submitted" : status;
  const clinical = usePaginatedQuery(
    anyApi.careRequests.listClinicalQueuePage,
    role === "clinician" ? { status: selectedStatus } : "skip",
    { initialNumItems },
  );
  const counselor = usePaginatedQuery(
    anyApi.careRequests.listCounselorQueue,
    role === "counselor" ? { status: selectedStatus } : "skip",
    { initialNumItems },
  );
  const admin = usePaginatedQuery(
    anyApi.careRequests.listAdminQueuePage,
    role === "admin" ? { requestType: "all" as const, status } : "skip",
    { initialNumItems },
  );
  const selected = role === "admin" ? admin : role === "clinician" ? clinical : counselor;
  return {
    results: (selected?.results ?? []) as StaffRequest[],
    status: selected?.status ?? "LoadingFirstPage",
    loadMore: selected?.loadMore,
  };
}

function statusLabel(status: RequestStatus) {
  return status === "inReview" ? "In review" : status[0].toUpperCase() + status.slice(1);
}

export function StaffRequests() {
  const { isLoaded, role } = useStaffRole();
  const [status, setStatus] = useState<QueueStatus>("submitted");
  const queue = useRoleQueue(role, status);

  if (!isLoaded) return <LoadingState label="Loading request queue..." />;
  if (!role) return <AccessState />;

  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#438451]">CARE OPERATIONS</p>
      <h1 className="mt-3 text-4xl font-semibold">Request queue</h1>
      <p className="mt-3 text-[#68796d]">Requests available to your staff role.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {role === "admin" && (
          <FilterButton selected={status === "all"} onClick={() => setStatus("all")}>
            All requests
          </FilterButton>
        )}
        {statuses.map((item) => (
          <FilterButton key={item} selected={status === item} onClick={() => setStatus(item)}>
            {statusLabel(item)}
          </FilterButton>
        ))}
      </div>

      {queue.status === "LoadingFirstPage" ? (
        <LoadingState label="Loading requests..." />
      ) : queue.results.length > 0 ? (
        <div className="mt-6 grid gap-3">
          {queue.results.map((request) => (
            <RequestCard key={request._id} request={request} />
          ))}
          {queue.status !== "Exhausted" && queue.loadMore && (
            <button
              type="button"
              onClick={() => queue.loadMore?.(25)}
              disabled={queue.status === "LoadingMore"}
              className="justify-self-center rounded-full border border-[#cbd8cb] bg-white px-4 py-2 text-sm font-bold text-[#287343] disabled:opacity-50"
            >
              {queue.status === "LoadingMore" ? "Loading..." : "Load more"}
            </button>
          )}
        </div>
      ) : (
        <EmptyState label="No requests in this queue." />
      )}
    </section>
  );
}

export function StaffClients() {
  const { isLoaded, role } = useStaffRole();
  const submitted = useRoleQueue(role, "submitted", 20);
  const inReview = useRoleQueue(role, "inReview", 20);
  const contacted = useRoleQueue(role, "contacted", 20);
  const closed = useRoleQueue(role, "closed", 20);

  const cases = useMemo(() => {
    const records = [
      ...submitted.results,
      ...inReview.results,
      ...contacted.results,
      ...closed.results,
    ];
    const assigned = records.filter((request) =>
      role === "admin"
        ? Boolean(request.assignedToProfileId)
        : request.assignedToMe,
    );
    return [...new Map(assigned.map((request) => [request._id, request])).values()]
      .sort((left, right) => right.createdAt - left.createdAt);
  }, [role, submitted.results, inReview.results, contacted.results, closed.results]);

  if (!isLoaded) return <LoadingState label="Loading assigned cases..." />;
  if (!role) return <AccessState />;

  const loading = [submitted, inReview, contacted, closed].some(
    (queue) => queue.status === "LoadingFirstPage",
  );

  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#438451]">ASSIGNED CASES</p>
      <h1 className="mt-3 text-4xl font-semibold">Assigned care requests</h1>
      <p className="mt-3 text-[#68796d]">Cases assigned to you, or to your team if you are an administrator.</p>
      {loading ? (
        <LoadingState label="Loading assigned cases..." />
      ) : cases.length > 0 ? (
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cases.map((request) => (
            <RequestCard key={request._id} request={request} />
          ))}
        </div>
      ) : (
        <EmptyState label="No assigned care requests are available." />
      )}
    </section>
  );
}

export function StaffAppointments() {
  const { isLoaded, role } = useStaffRole();
  const [now] = useState(() => Date.now());
  const staffAppointments = useQuery(
    anyApi.appointments.listMyAppointments,
    role && role !== "admin" ? {} : "skip",
  ) as StaffAppointment[] | undefined;
  const adminAppointments = useQuery(
    anyApi.appointments.listUpcomingForAdmin,
    role === "admin" ? { now } : "skip",
  ) as StaffAppointment[] | undefined;
  const appointments = (role === "admin" ? adminAppointments : staffAppointments)?.filter(
    (appointment) => appointment.scheduledAt >= now,
  );

  if (!isLoaded) return <LoadingState label="Loading appointments..." />;
  if (!role) return <AccessState />;

  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#438451]">CALENDAR</p>
      <h1 className="mt-3 text-4xl font-semibold">Appointments</h1>
      {appointments === undefined ? (
        <LoadingState label="Loading appointments..." />
      ) : appointments.length > 0 ? (
        <div className="mt-8">
          <AppointmentDayCalendar appointments={appointments} />
        </div>
      ) : (
        <EmptyState label="No upcoming appointments are scheduled." />
      )}
    </section>
  );
}

function RequestCard({ request }: { request: StaffRequest }) {
  return (
    <Link
      href={`/staff/clients/${request._id}`}
      className="flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-[#dce8de] bg-white p-5 hover:border-[#87b791]"
    >
      <div>
        <p className="text-xs font-bold tracking-[0.08em] text-[#579165]">
          {request.requestType === "clinical" ? "Clinical" : "Counselling"} · {new Date(request.createdAt).toLocaleDateString()}
        </p>
        <h2 className="mt-2 font-semibold text-[#2e4434]">
          {request.requestSummary || "Care request"}
        </h2>
        {request.assignedToName && (
          <p className="mt-1 text-sm text-[#7a887d]">Assigned to {request.assignedToName}</p>
        )}
      </div>
      <span className="rounded-full bg-[#e7f2e9] px-3 py-1 text-xs font-bold text-[#397047]">
        {statusLabel(request.status)}
      </span>
    </Link>
  );
}

function FilterButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3.5 py-2 text-xs font-bold ${
        selected ? "bg-[#1c573e] text-white" : "border border-[#cbd8cb] bg-white text-[#4e6655]"
      }`}
    >
      {children}
    </button>
  );
}

function LoadingState({ label }: { label: string }) {
  return <p className="mt-8 rounded-xl border border-[#dce8de] bg-white p-6 text-sm text-[#68796d]">{label}</p>;
}

function EmptyState({ label }: { label: string }) {
  return <p className="mt-8 rounded-xl border border-dashed border-[#dce8de] bg-white p-8 text-center text-sm text-[#68796d]">{label}</p>;
}

function AccessState() {
  return (
    <section className="rounded-2xl border border-[#dce8de] bg-white p-8">
      <h1 className="text-xl font-semibold text-[#163826]">Staff access is not assigned</h1>
      <p className="mt-2 text-sm text-[#68796d]">
        Ask an administrator to add your verified account to the staff directory.
      </p>
    </section>
  );
}
