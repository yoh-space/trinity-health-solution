"use client";

import Link from "next/link";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { usePaginatedQuery, useQuery } from "convex/react";
import { anyApi } from "convex/server";

type StaffRole = "admin" | "clinician" | "counselor";
type Count = number | "100+";

interface QueueCounts {
  submitted: Count;
  inReview: Count;
  contacted: Count;
  closed: Count;
}

interface RequestRow {
  _id: string;
  requestType: "clinical" | "counselling";
  status: "submitted" | "inReview" | "contacted" | "closed";
  requestSummary?: string;
  createdAt: number;
}

interface AppointmentRow {
  _id: string;
  requestId: string;
  requestType: "clinical" | "counselling";
  requestSummary?: string;
  scheduledAt: number;
  durationMinutes: number;
  format: "online" | "inPerson";
  staffName?: string;
}

const ADMIN_EMAILS = new Set(["yohansdam@gmail.com", "yashaknike@gmail.com"]);

function addCounts(first: Count, second: Count): Count {
  return first === "100+" || second === "100+" ? "100+" : first + second;
}

export function StaffDashboard() {
  const { user, isLoaded } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
  const metadataRole = user?.publicMetadata?.role;
  const role: StaffRole | null =
    ADMIN_EMAILS.has(userEmail ?? "") || metadataRole === "admin"
      ? "admin"
      : metadataRole === "clinician" || metadataRole === "counselor"
        ? metadataRole
        : null;
  const [now] = useState(() => Date.now());

  const adminOverview = useQuery(
    anyApi.careRequests.getAdminDashboardOverview,
    role === "admin" ? {} : "skip",
  ) as
    | {
        counts: { clinical: QueueCounts; counselling: QueueCounts };
      }
    | undefined;
  const clinicalCounts = useQuery(
    anyApi.careRequests.getClinicalQueueCounts,
    role === "clinician" ? {} : "skip",
  ) as QueueCounts | undefined;
  const counselorCounts = useQuery(
    anyApi.careRequests.getCounselorQueueCounts,
    role === "counselor" ? {} : "skip",
  ) as QueueCounts | undefined;

  const clinicalQueue = usePaginatedQuery(
    anyApi.careRequests.listClinicalQueuePage,
    role === "clinician" ? { status: "submitted" as const } : "skip",
    { initialNumItems: 5 },
  );
  const counselorQueue = usePaginatedQuery(
    anyApi.careRequests.listCounselorQueue,
    role === "counselor" ? { status: "submitted" as const } : "skip",
    { initialNumItems: 5 },
  );
  const adminQueue = usePaginatedQuery(
    anyApi.careRequests.listAdminQueuePage,
    role === "admin"
      ? { requestType: "all" as const, status: "all" as const }
      : "skip",
    { initialNumItems: 5 },
  );

  const staffAppointments = useQuery(
    anyApi.appointments.listMyAppointments,
    role && role !== "admin" ? {} : "skip",
  ) as AppointmentRow[] | undefined;
  const adminAppointments = useQuery(
    anyApi.appointments.listUpcomingForAdmin,
    role === "admin" ? { now } : "skip",
  ) as AppointmentRow[] | undefined;

  if (!isLoaded || (role && role !== "admin" && !user)) {
    return <p className="text-sm text-[#68796d]">Loading staff workspace...</p>;
  }

  if (!role) {
    return (
      <section className="rounded-2xl border border-[#dce8de] bg-white p-8">
        <h1 className="text-xl font-semibold text-[#163826]">Staff access is not assigned</h1>
        <p className="mt-2 text-sm text-[#68796d]">
          Ask an administrator to add your verified account to the staff directory.
        </p>
      </section>
    );
  }

  const counts =
    role === "admin"
      ? adminOverview && {
          submitted: addCounts(
            adminOverview.counts.clinical.submitted,
            adminOverview.counts.counselling.submitted,
          ),
          inReview: addCounts(
            adminOverview.counts.clinical.inReview,
            adminOverview.counts.counselling.inReview,
          ),
          contacted: addCounts(
            adminOverview.counts.clinical.contacted,
            adminOverview.counts.counselling.contacted,
          ),
          closed: addCounts(
            adminOverview.counts.clinical.closed,
            adminOverview.counts.counselling.closed,
          ),
        }
      : role === "clinician"
        ? clinicalCounts
        : counselorCounts;
  const requests = (
    role === "admin"
      ? adminQueue.results
      : role === "clinician"
        ? clinicalQueue.results
        : counselorQueue.results
  ) as RequestRow[];
  const appointments = (role === "admin" ? adminAppointments : staffAppointments)?.filter(
    (appointment) => appointment.scheduledAt >= now,
  );

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#438451]">
            {role.toUpperCase()} DESK
          </p>
          <h1 className="mt-3 text-4xl font-semibold">
            Good day, {user?.firstName ?? "team member"}.
          </h1>
          <p className="mt-3 text-[#68796d]">
            Live care requests and appointments for your staff role.
          </p>
        </div>
        <Link
          href="/staff/requests"
          className="rounded-full bg-[#287343] px-5 py-3 text-sm font-bold text-white"
        >
          Open request queue
        </Link>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        <Metric
          label="Submitted requests"
          value={counts?.submitted ?? "—"}
          detail={counts ? "Current database count" : "Loading request counts..."}
        />
        <Metric
          label="In review"
          value={counts?.inReview ?? "—"}
          detail={counts ? "Current database count" : "Loading request counts..."}
        />
        <Metric
          label="Upcoming appointments"
          value={appointments === undefined ? "—" : appointments.length}
          detail={appointments ? "Scheduled in Convex" : "Loading appointments..."}
        />
      </div>

      <section className="mt-10 rounded-3xl border border-[#dce8de] bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent requests</h2>
          <Link href="/staff/requests" className="text-sm font-bold text-[#438451]">
            See all
          </Link>
        </div>
        {requests.length > 0 ? (
          <div className="mt-5 grid gap-3">
            {requests.map((request) => (
              <Link
                href={`/staff/clients/${request._id}`}
                key={request._id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#e1ebe2] p-4 hover:border-[#87b791]"
              >
                <div>
                  <p className="text-xs font-bold tracking-[0.08em] text-[#579165]">
                    {request.requestType === "clinical" ? "Clinical" : "Counselling"} · {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                  <h3 className="mt-2 font-semibold text-[#2e4434]">
                    {request.requestSummary || "Care request"}
                  </h3>
                </div>
                <span className="rounded-full bg-[#e7f2e9] px-3 py-1 text-xs font-bold capitalize text-[#397047]">
                  {request.status === "inReview" ? "In review" : request.status}
                </span>
              </Link>
            ))}
          </div>
        ) : requests.length === 0 && counts !== undefined ? (
          <p className="mt-5 rounded-xl border border-dashed border-[#dce8de] p-6 text-center text-sm text-[#68796d]">
            No submitted requests are available.
          </p>
        ) : (
          <p className="mt-5 text-sm text-[#68796d]">Loading requests...</p>
        )}
      </section>
    </>
  );
}

function Metric({
  label,
  value,
  detail,
}: {
  label: string;
  value: string | number;
  detail: string;
}) {
  return (
    <div className="rounded-3xl border border-[#dce8de] bg-white p-5">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6e8273]">
        {label}
      </p>
      <p className="mt-4 text-3xl font-semibold text-[#245d37]">{value}</p>
      <p className="mt-2 text-sm text-[#7b8b80]">{detail}</p>
    </div>
  );
}