"use client";

import { useState } from "react";
import { UserCheck, Stethoscope, HeartHandshake, Shield, Circle, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";

export interface TeamMemberItem {
  _id: string;
  clerkUserId?: string;
  role: "clinician" | "counselor" | "admin";
  displayName: string;
  specialty: string;
  availability: "available" | "away";
  active: boolean;
  openRequestCount: number | "100+";
}

export function AdminStaffRoster({
  teamMembers,
}: {
  teamMembers: TeamMemberItem[];
}) {
  const [roleFilter, setRoleFilter] = useState<"all" | "clinician" | "counselor" | "admin">("all");

  const filteredMembers = teamMembers.filter((m) => {
    if (roleFilter !== "all" && m.role !== roleFilter) return false;
    return true;
  });

  const getRoleIcon = (role: TeamMemberItem["role"]) => {
    switch (role) {
      case "clinician":
        return <Stethoscope size={15} className="text-[#1c573e]" />;
      case "counselor":
        return <HeartHandshake size={15} className="text-[#b45d34]" />;
      case "admin":
        return <Shield size={15} className="text-[#3b5e7d]" />;
    }
  };

  const getRoleBadge = (role: TeamMemberItem["role"]) => {
    switch (role) {
      case "clinician":
        return <Badge variant="emerald">Clinician</Badge>;
      case "counselor":
        return <Badge variant="terracotta">Counselor</Badge>;
      case "admin":
        return <Badge variant="info">Admin</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="border-b border-[#eef2ea] pb-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <CardTitle>Staff & Practitioner Directory</CardTitle>
            <CardDescription>
              Monitor multi-role team coverage, real-time availability, and active caseloads
            </CardDescription>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-[#d2ddd0] bg-white p-1 text-xs">
            <button
              onClick={() => setRoleFilter("all")}
              className={`rounded-full px-3 py-1 font-semibold transition ${
                roleFilter === "all" ? "bg-[#1c573e] text-white" : "text-[#5b6e61]"
              }`}
            >
              All ({teamMembers.length})
            </button>
            <button
              onClick={() => setRoleFilter("clinician")}
              className={`rounded-full px-3 py-1 font-semibold transition ${
                roleFilter === "clinician" ? "bg-[#1c573e] text-white" : "text-[#5b6e61]"
              }`}
            >
              Clinicians
            </button>
            <button
              onClick={() => setRoleFilter("counselor")}
              className={`rounded-full px-3 py-1 font-semibold transition ${
                roleFilter === "counselor" ? "bg-[#1c573e] text-white" : "text-[#5b6e61]"
              }`}
            >
              Counselors
            </button>
            <button
              onClick={() => setRoleFilter("admin")}
              className={`rounded-full px-3 py-1 font-semibold transition ${
                roleFilter === "admin" ? "bg-[#1c573e] text-white" : "text-[#5b6e61]"
              }`}
            >
              Admins
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#eef2ea] bg-[#f9faf7] text-[11px] font-bold uppercase tracking-wider text-[#687d6f]">
              <tr>
                <th className="px-6 py-3.5">Name & Identity</th>
                <th className="px-6 py-3.5">Assigned Role</th>
                <th className="px-6 py-3.5">Specialty Area</th>
                <th className="px-6 py-3.5">Availability</th>
                <th className="px-6 py-3.5">Active Caseload</th>
                <th className="px-6 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f4ee]">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-xs text-[#718476]">
                    No team members found for the selected role filter.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member._id} className="transition hover:bg-[#f6f9f5]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="grid size-9 place-items-center rounded-full bg-[#e8efe6] font-bold text-[#1c573e]">
                          {member.displayName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-[#193a27]">{member.displayName}</p>
                          <p className="text-[10px] text-[#788a7c]">
                            {member.clerkUserId ? `ID: ${member.clerkUserId.slice(0, 12)}...` : "System Staff"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        {getRoleIcon(member.role)}
                        {getRoleBadge(member.role)}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-[#4b6051]">
                      {member.specialty || "General Health Outreach"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          member.availability === "available"
                            ? "bg-[#dcfce7] text-[#15803d]"
                            : "bg-[#fef3c7] text-[#b45309]"
                        }`}
                      >
                        <Circle
                          size={7}
                          className={
                            member.availability === "available"
                              ? "fill-[#15803d] text-[#15803d]"
                              : "fill-[#b45309] text-[#b45309]"
                          }
                        />
                        {member.availability === "available" ? "On Duty" : "Away"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#193b28]">
                          {member.openRequestCount}
                        </span>
                        <span className="text-[11px] text-[#718476]">cases</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Badge variant={member.active ? "success" : "destructive"}>
                        {member.active ? "Active" : "Inactive"}
                      </Badge>
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
