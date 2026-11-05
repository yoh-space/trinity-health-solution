"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import { ArrowLeft } from "lucide-react";

interface StaffRequestDetails {
  _id: string;
  requestType: "clinical" | "counselling";
  contactMethod: "email" | "phone";
  contactDetails: string;
  requestSummary?: string;
  status: "submitted" | "inReview" | "contacted" | "closed";
  createdAt: number;
  updatedAt: number;
  assignedToMe: boolean;
  assignedToName?: string;
}

export default function StaffClientPage() {
  const params = useParams<{ clientId: string }>();
  const request = useQuery(anyApi.careRequests.getStaffRequestDetails, {
    requestId: params.clientId as any,
  }) as StaffRequestDetails | null | undefined;

  return (
    <section>
      <Link href="/staff/clients" className="text-sm font-bold text-[#438451]">
        <span className="inline-flex items-center gap-2">
          <ArrowLeft size={15} aria-hidden="true" />
          Back to clients
        </span>
      </Link>
      {request === undefined ? (
        <p className="mt-10 rounded-xl border border-[#dce8de] bg-white p-6 text-sm text-[#68796d]">
          Loading care request...
        </p>
      ) : request === null ? (
        <p className="mt-10 rounded-xl border border-dashed border-[#dce8de] bg-white p-8 text-center text-sm text-[#68796d]">
          This care request is no longer available.
        </p>
      ) : (
        <>
      <div className="mt-10 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#438451]">
            {request.requestType === "clinical" ? "CLINICAL REQUEST" : "COUNSELLING REQUEST"}
          </p>
          <h1 className="mt-3 text-4xl font-semibold">
            {request.requestSummary || "Care request"}
          </h1>
          <p className="mt-3 text-[#68796d]">
            Submitted {new Date(request.createdAt).toLocaleDateString()} · {request.contactMethod}
          </p>
        </div>
        <span className="rounded-full bg-[#e7f2e9] px-3 py-1.5 text-xs font-bold text-[#397047]">
          {request.status === "inReview" ? "In review" : request.status}
        </span>
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-[#dce8de] bg-white p-6">
          <h2 className="text-xl font-semibold">Request details</h2>
          <dl className="mt-4 space-y-3 text-sm text-[#68796d]">
            <div className="flex justify-between gap-4"><dt>Contact method</dt><dd className="font-semibold capitalize text-[#2e4434]">{request.contactMethod}</dd></div>
            <div className="flex justify-between gap-4"><dt>Contact details</dt><dd className="font-semibold text-[#2e4434]">{request.contactDetails}</dd></div>
            <div className="flex justify-between gap-4"><dt>Assigned staff</dt><dd className="font-semibold text-[#2e4434]">{request.assignedToName || "Unassigned"}</dd></div>
          </dl>
        </section>
        <section className="rounded-3xl border border-[#dce8de] bg-white p-6">
          <h2 className="text-xl font-semibold">Staff notes</h2>
          <p className="mt-4 text-sm leading-7 text-[#68796d]">
            No staff notes are attached to this request.
          </p>
        </section>
      </div>
        </>
      )}
    </section>
  );
}
