"use client";

import { useMemo } from "react";
import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import { AdminStaffRoster, TeamMemberItem } from "@/components/admin/AdminStaffRoster";
import { ShieldCheck } from "lucide-react";

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

      {teamPage === undefined ? (
        <p className="rounded-xl border border-[#dce6dc] bg-white p-5 text-sm text-[#657a6b]">
          Loading team directory...
        </p>
      ) : teamPage.page.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[#dce6dc] bg-white p-8 text-center text-sm text-[#657a6b]">
          No staff profiles are in the directory yet.
        </p>
      ) : (
        <AdminStaffRoster teamMembers={teamPage.page} />
      )}
    </section>
  );
}
