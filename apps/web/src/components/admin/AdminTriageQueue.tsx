"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { anyApi } from "convex/server";
import {
  Search,
  Filter,
  UserCheck,
  Clock,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  UserPlus,
  X,
  FileText,
  Loader2,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";

export interface CareRequestItem {
  _id: string;
  requestType: "clinical" | "counselling";
  status: "submitted" | "inReview" | "contacted" | "closed";
  contactMethod?: "email" | "phone";
  contactDetails?: string;
  requestSummary?: string;
  assignedTo?: string;
  assignedStaffName?: string;
  createdAt: number;
}

export interface AvailableStaff {
  _id: string;
  clerkUserId?: string;
  displayName: string;
  role: "clinician" | "counselor" | "admin";
  specialty?: string;
  availability?: "available" | "away";
}

export function AdminTriageQueue({
  requests,
  staffList = [],
}: {
  requests: CareRequestItem[];
  staffList?: AvailableStaff[];
}) {
  const assignRequest = useMutation(anyApi.careRequests.assignAdminRequest);
  const updateStatus = useMutation(anyApi.careRequests.updateAdminRequestStatus);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "clinical" | "counselling">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "submitted" | "inReview" | "contacted" | "closed">("all");

  // Selection & Modal states
  const [assigningReq, setAssigningReq] = useState<CareRequestItem | null>(null);
  const [viewingReq, setViewingReq] = useState<CareRequestItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionNotice, setActionNotice] = useState<{ text: string; error?: boolean } | null>(null);

  function notify(text: string, error = false) {
    setActionNotice({ text, error });
    setTimeout(() => setActionNotice(null), 4000);
  }

  const filteredRequests = requests.filter((req) => {
    if (roleFilter !== "all" && req.requestType !== roleFilter) return false;
    if (statusFilter !== "all" && req.status !== statusFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchSummary = req.requestSummary?.toLowerCase().includes(term);
      const matchContact = req.contactDetails?.toLowerCase().includes(term);
      return matchSummary || matchContact;
    }
    return true;
  });

  async function handleAssign(requestId: string, staffProfileId: string | null) {
    setIsSubmitting(true);
    try {
      await assignRequest({
        requestId: requestId as any,
        staffProfileId: staffProfileId as any,
      });
      notify(staffProfileId ? "Request assigned successfully." : "Request unassigned.");
      setAssigningReq(null);
    } catch (err) {
      notify(err instanceof Error ? err.message : "Failed to assign request.", true);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleStatusChange(requestId: string, nextStatus: CareRequestItem["status"]) {
    try {
      await updateStatus({
        requestId: requestId as any,
        status: nextStatus,
      });
      notify(`Status updated to ${nextStatus}.`);
    } catch (err) {
      notify(err instanceof Error ? err.message : "Failed to update status.", true);
    }
  }

  const getStatusBadge = (status: CareRequestItem["status"]) => {
    switch (status) {
      case "submitted":
        return <Badge variant="warning">Submitted</Badge>;
      case "inReview":
        return <Badge variant="info">In Review</Badge>;
      case "contacted":
        return <Badge variant="emerald">Contacted</Badge>;
      case "closed":
        return <Badge variant="success">Closed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const eligibleStaff = assigningReq
    ? staffList.filter((s) =>
        assigningReq.requestType === "clinical"
          ? s.role === "clinician"
          : s.role === "counselor"
      )
    : [];

  return (
    <>
      <Card>
        <CardHeader className="border-b border-[#eef2ea] pb-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <CardTitle>Care Request Triage & Queue</CardTitle>
              <CardDescription>
                Allocate incoming family requests across clinical and counseling practitioners
              </CardDescription>
            </div>
            <span className="text-xs font-semibold text-[#617466]">
              Showing {filteredRequests.length} of {requests.length} requests
            </span>
          </div>

          {/* Toast Notification */}
          {actionNotice && (
            <div
              className={`mt-3 flex items-center gap-2.5 rounded-xl px-4 py-2 text-xs font-semibold ${
                actionNotice.error
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-emerald-50 text-emerald-800 border border-emerald-200"
              }`}
            >
              {actionNotice.error ? <AlertCircle size={15} /> : <CheckCircle size={15} />}
              <span>{actionNotice.text}</span>
            </div>
          )}

          {/* Filter Toolbar */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative min-w-55 flex-1">
              <Search
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#839688]"
              />
              <input
                type="text"
                placeholder="Search requests, summaries, or contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-full border border-[#d2ddd0] bg-white py-2 pl-9 pr-4 text-xs font-medium text-[#1c3a2a] placeholder-[#8a9d8f] focus:border-[#1c573e] focus:outline-hidden"
              />
            </div>

            {/* Role Filter */}
            <div className="flex items-center gap-1.5 rounded-full border border-[#d2ddd0] bg-white p-1 text-xs">
              <button
                onClick={() => setRoleFilter("all")}
                className={`rounded-full px-3 py-1 font-semibold transition ${
                  roleFilter === "all" ? "bg-[#1c573e] text-white" : "text-[#5b6e61]"
                }`}
              >
                All Roles
              </button>
              <button
                onClick={() => setRoleFilter("clinical")}
                className={`rounded-full px-3 py-1 font-semibold transition ${
                  roleFilter === "clinical" ? "bg-[#1c573e] text-white" : "text-[#5b6e61]"
                }`}
              >
                Clinical
              </button>
              <button
                onClick={() => setRoleFilter("counselling")}
                className={`rounded-full px-3 py-1 font-semibold transition ${
                  roleFilter === "counselling" ? "bg-[#1c573e] text-white" : "text-[#5b6e61]"
                }`}
              >
                Counselling
              </button>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="rounded-full border border-[#d2ddd0] bg-white px-3.5 py-2 text-xs font-semibold text-[#294a37] focus:outline-hidden"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="inReview">In Review</option>
              <option value="contacted">Contacted</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#eef2ea] bg-[#f9faf7] text-[11px] font-bold uppercase tracking-wider text-[#687d6f]">
                <tr>
                  <th className="px-6 py-3.5">Request</th>
                  <th className="px-6 py-3.5">Role / Type</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Contact Mode</th>
                  <th className="px-6 py-3.5">Assigned Staff</th>
                  <th className="px-6 py-3.5">Received</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f4ee]">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-xs text-[#718476]">
                      No requests match the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((req) => (
                    <tr key={req._id} className="transition hover:bg-[#f6f9f5]">
                      <td className="px-6 py-4 font-semibold text-[#1f402e]">
                        <button
                          type="button"
                          onClick={() => setViewingReq(req)}
                          className="flex max-w-56 items-center gap-1.5 text-left hover:underline"
                        >
                          <span className="truncate">
                            {req.requestSummary || `${req.requestType === "clinical" ? "Clinical" : "Counselling"} care request`}
                          </span>
                          <FileText size={12} className="shrink-0 text-[#687e70]" />
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                            req.requestType === "clinical"
                              ? "bg-[#e5eddf] text-[#1c573e]"
                              : "bg-[#faeee5] text-[#b45d34]"
                          }`}
                        >
                          {req.requestType === "clinical" ? "Clinical" : "Counselling"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={req.status}
                          onChange={(e) => handleStatusChange(req._id, e.target.value as any)}
                          className="rounded-lg border border-[#d2ddd0] bg-white px-2 py-1 text-xs font-semibold text-[#183925] focus:outline-hidden"
                        >
                          <option value="submitted">Submitted</option>
                          <option value="inReview">In Review</option>
                          <option value="contacted">Contacted</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5 text-[#506657]">
                          {req.contactMethod === "phone" ? (
                            <Phone size={13} className="text-[#3b5e47]" />
                          ) : (
                            <Mail size={13} className="text-[#3b5e47]" />
                          )}
                          <span>{req.contactMethod === "phone" ? "Phone Call" : "Email"}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {req.assignedStaffName || req.assignedTo ? (
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1.5 font-semibold text-[#1f422f]">
                              <UserCheck size={14} className="text-[#287343]" />
                              <span>{req.assignedStaffName || "Assigned"}</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => setAssigningReq(req)}
                              className="text-[10px] text-[#1c573e] hover:underline font-bold"
                            >
                              Reassign
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setAssigningReq(req)}
                            className="inline-flex items-center gap-1 rounded-full border border-dashed border-[#1c573e]/50 px-2.5 py-0.5 text-[11px] font-bold text-[#1c573e] hover:bg-[#edf5ee]"
                          >
                            <UserPlus size={12} />
                            <span>Assign</span>
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 text-[#6b7d70]">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setViewingReq(req)}
                          className="rounded-full border border-[#d2ddd0] bg-white px-3 py-1 text-[11px] font-bold text-[#244b34] hover:bg-[#edf4ec]"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* --- ASSIGN STAFF MODAL --- */}
      {assigningReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl border border-[#d8e3d8] bg-white p-6 shadow-2xl">
            <button
              onClick={() => setAssigningReq(null)}
              className="absolute right-4 top-4 grid size-8 place-items-center rounded-full text-[#6b7e71] hover:bg-[#f1f6f1]"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold text-[#163826]">
              Assign {assigningReq.requestType === "clinical" ? "Clinician" : "Counselor"}
            </h3>
            <p className="mt-1 text-xs text-[#677a6d]">
              Choose a practitioner on duty to handle this request.
            </p>

            <div className="mt-5 space-y-2 max-h-60 overflow-y-auto">
              {eligibleStaff.length === 0 ? (
                <p className="p-4 text-center text-xs text-[#718476]">
                  No active {assigningReq.requestType === "clinical" ? "clinicians" : "counselors"} found in the directory. Please add team members in the Staff Directory first.
                </p>
              ) : (
                eligibleStaff.map((staff) => (
                  <button
                    key={staff._id}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleAssign(assigningReq._id, staff._id)}
                    className="flex w-full items-center justify-between rounded-xl border border-[#dfe7df] p-3 text-left transition hover:bg-[#edf6ed] hover:border-[#1c573e]"
                  >
                    <div>
                      <p className="font-bold text-xs text-[#1c3e2b]">{staff.displayName}</p>
                      <p className="text-[10px] text-[#697d6f]">{staff.specialty || "Public Health Practice"}</p>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase rounded-full px-2 py-0.5 ${
                        staff.availability === "available"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {staff.availability === "available" ? "On Duty" : "Away"}
                    </span>
                  </button>
                ))
              )}
            </div>

            {assigningReq.assignedTo && (
              <div className="mt-4 border-t border-[#edf3ed] pt-3 flex justify-between items-center">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleAssign(assigningReq._id, null)}
                  className="text-xs font-bold text-red-600 hover:underline"
                >
                  Unassign Current Provider
                </button>
                <button
                  type="button"
                  onClick={() => setAssigningReq(null)}
                  className="rounded-full border border-[#d2ddd0] px-4 py-1.5 text-xs font-semibold text-[#54685a] hover:bg-[#f6f9f5]"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- VIEW REQUEST DETAILS MODAL --- */}
      {viewingReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl border border-[#d8e3d8] bg-white p-6 shadow-2xl sm:p-8">
            <button
              onClick={() => setViewingReq(null)}
              className="absolute right-5 top-5 grid size-8 place-items-center rounded-full text-[#6b7e71] hover:bg-[#f1f6f1]"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                  viewingReq.requestType === "clinical"
                    ? "bg-[#e5eddf] text-[#1c573e]"
                    : "bg-[#faeee5] text-[#b45d34]"
                }`}
              >
                {viewingReq.requestType}
              </span>
              {getStatusBadge(viewingReq.status)}
            </div>

            <h3 className="mt-2 text-xl font-bold text-[#163826]">
              Care request details
            </h3>

            <div className="mt-5 space-y-3.5 text-xs">
              <div className="rounded-xl border border-[#dfe7df] bg-[#f9faf7] p-3.5">
                <span className="block text-[11px] font-bold text-[#627768] uppercase">
                  Client Inquiry Summary
                </span>
                <p className="mt-1 text-sm text-[#183926] leading-relaxed">
                  {viewingReq.requestSummary || "Family requested consultation and guidance."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[#dfe7df] p-3">
                  <span className="block text-[10px] font-bold text-[#627768] uppercase">
                    Contact Method
                  </span>
                  <p className="mt-0.5 font-bold text-[#183926] capitalize">
                    {viewingReq.contactMethod || "Phone"}
                  </p>
                  <p className="text-[11px] text-[#718576]">
                    {viewingReq.contactDetails || "Client on file"}
                  </p>
                </div>

                <div className="rounded-xl border border-[#dfe7df] p-3">
                  <span className="block text-[10px] font-bold text-[#627768] uppercase">
                    Assigned Provider
                  </span>
                  <p className="mt-0.5 font-bold text-[#183926]">
                    {viewingReq.assignedStaffName || (viewingReq.assignedTo ? "Assigned" : "Unassigned")}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      const req = viewingReq;
                      setViewingReq(null);
                      setAssigningReq(req);
                    }}
                    className="text-[10px] font-bold text-[#1c573e] hover:underline"
                  >
                    Change Provider
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-[#dfe7df] p-3">
                <span className="block text-[10px] font-bold text-[#627768] uppercase">
                  Triage Status Transition
                </span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(["submitted", "inReview", "contacted", "closed"] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(viewingReq._id, st)}
                      className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                        viewingReq.status === st
                          ? "bg-[#1c573e] text-white"
                          : "border border-[#d2ddd0] bg-white text-[#55695a] hover:bg-[#f1f6f1]"
                      }`}
                    >
                      {st === "submitted"
                        ? "1. Submitted"
                        : st === "inReview"
                          ? "2. In Review"
                          : st === "contacted"
                            ? "3. Contacted"
                            : "4. Closed"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end pt-3 border-t border-[#edf3ed]">
              <button
                type="button"
                onClick={() => setViewingReq(null)}
                className="rounded-full bg-[#1c573e] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#154631]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
