"use client";

import { useState } from "react";
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

export function AdminTriageQueue({
  requests,
  onAssign,
  onUpdateStatus,
}: {
  requests: CareRequestItem[];
  onAssign?: (requestId: string, staffUserId: string) => Promise<void>;
  onUpdateStatus?: (requestId: string, nextStatus: "inReview" | "contacted" | "closed") => Promise<void>;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "clinical" | "counselling">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "submitted" | "inReview" | "contacted" | "closed">("all");

  const filteredRequests = requests.filter((req) => {
    if (roleFilter !== "all" && req.requestType !== roleFilter) return false;
    if (statusFilter !== "all" && req.status !== statusFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchSummary = req.requestSummary?.toLowerCase().includes(term);
      const matchContact = req.contactDetails?.toLowerCase().includes(term);
      const matchId = req._id.toLowerCase().includes(term);
      return matchSummary || matchContact || matchId;
    }
    return true;
  });

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

  return (
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

        {/* Filter Toolbar */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative min-w-[220px] flex-1">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#839688]"
            />
            <input
              type="text"
              placeholder="Search by ID, summary, or contact..."
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
                <th className="px-6 py-3.5">Request ID</th>
                <th className="px-6 py-3.5">Role / Type</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Contact Mode</th>
                <th className="px-6 py-3.5">Assigned Provider</th>
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
                    <td className="px-6 py-4 font-mono font-bold text-[#1f402e]">
                      {req._id.slice(0, 10)}...
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
                    <td className="px-6 py-4">{getStatusBadge(req.status)}</td>
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
                        <span className="flex items-center gap-1.5 font-semibold text-[#1f422f]">
                          <UserCheck size={14} className="text-[#287343]" />
                          <span>{req.assignedStaffName || "Assigned Provider"}</span>
                        </span>
                      ) : (
                        <span className="text-[#96a49a] italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-[#6b7d70]">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {req.status === "submitted" && onUpdateStatus && (
                          <button
                            onClick={() => onUpdateStatus(req._id, "inReview")}
                            className="rounded-full bg-[#1c573e] px-2.5 py-1 text-[11px] font-bold text-white transition hover:bg-[#14422f]"
                          >
                            Triage
                          </button>
                        )}
                        {req.status === "inReview" && onUpdateStatus && (
                          <button
                            onClick={() => onUpdateStatus(req._id, "contacted")}
                            className="rounded-full bg-[#3b82f6] px-2.5 py-1 text-[11px] font-bold text-white transition hover:bg-blue-700"
                          >
                            Contact
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
