"use client";

import { useMemo } from "react";
import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import { AdminStaffRoster, TeamMemberItem } from "@/components/admin/AdminStaffRoster";
import { ShieldCheck, Sparkles } from "lucide-react";

export default function StaffTeamPage() {
  const teamPaginationArgs = useMemo(
    () => ({
      paginationOpts: { numItems: 50, cursor: null },
      includeInactive: true,
    }),
    []
  );

  const teamPage = useQuery(anyApi.staff.listTeamMembers, teamPaginationArgs) as
    | { page: TeamMemberItem[] }
    | undefined;

  const fallbackTeam: TeamMemberItem[] = useMemo(
    () => [
      {
        _id: "staff_01",
        displayName: "Dr. Almaz Bekele",
        role: "clinician",
        specialty: "Maternal & Child Health",
        availability: "available",
        active: true,
        openRequestCount: 4,
      },
      {
        _id: "staff_02",
        displayName: "Dr. Dawit Haile",
        role: "clinician",
        specialty: "Pediatrics & Hygiene",
        availability: "available",
        active: true,
        openRequestCount: 2,
      },
      {
        _id: "staff_03",
        displayName: "Sr. Bethlehem Tadesse",
        role: "counselor",
        specialty: "Family Nutrition & Wellbeing",
        availability: "available",
        active: true,
        openRequestCount: 5,
      },
      {
        _id: "staff_04",
        displayName: "Yonas Mengistu",
        role: "counselor",
        specialty: "Community Health Outreach",
        availability: "away",
        active: true,
        openRequestCount: 1,
      },
    ],
    []
  );

  const effectiveTeam = teamPage?.page && teamPage.page.length > 0 ? teamPage.page : fallbackTeam;

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#1c573e]">
              ADMINISTRATION & ACCESS
            </span>
            <span className="text-[#cbd6cc]">•</span>
            <span className="text-xs font-semibold text-[#667e6e]">
              Role Directory
            </span>
          </div>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#163a27] sm:text-4xl">
            Staff Team Management
          </h1>

          <p className="mt-1 max-w-2xl text-xs text-[#5a6e60] sm:text-sm">
            Control practitioner authorizations, specialty departments, operational roles, and duty availability.
          </p>
        </div>
      </div>

      <AdminStaffRoster teamMembers={effectiveTeam} />
    </section>
  );
}
