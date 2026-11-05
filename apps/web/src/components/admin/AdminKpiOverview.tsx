"use client";

import {
  Stethoscope,
  Users,
  BookOpen,
  Calendar,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

export interface KpiOverviewData {
  totalCareRequests: number | "100+";
  clinicalRequests: number | "100+";
  counsellingRequests: number | "100+";
  submittedBacklog: number | "100+";
  activeStaffCount: number;
  availableStaffCount: number;
  clinicianCount: number;
  counselorCount: number;
  publishedNotesCount: number;
  draftNotesCount: number;
  upcomingAppointmentsCount: number;
  onlineAppointmentsCount: number;
}

export function AdminKpiOverview({ data }: { data: KpiOverviewData }) {
  const staffAvailabilityPct =
    data.activeStaffCount > 0
      ? Math.round((data.availableStaffCount / data.activeStaffCount) * 100)
      : null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* KPI Card 1: Care Requests Queue */}
      <Card className="relative overflow-hidden bg-white">
        <div className="absolute -right-6 -top-6 size-24 rounded-full bg-[#e7f1e9]/60 blur-xl" />
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#63796a]">
              Care Queue Load
            </span>
            <div className="grid size-9 place-items-center rounded-xl bg-[#e6f3ea] text-[#1c573e]">
              <Stethoscope size={18} />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-[#163a27]">
              {data.totalCareRequests}
            </span>
            <span className="text-xs text-[#708477]">total requests</span>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-xs text-[#526a5a]">
            <Badge variant="warning" className="text-[10px] px-2 py-0">
              {data.submittedBacklog} submitted
            </Badge>
            <span>•</span>
            <span>{data.clinicalRequests} clinical</span>
            <span>•</span>
            <span>{data.counsellingRequests} counsel</span>
          </div>

          <div className="mt-4 border-t border-[#edf2ea] pt-3 text-[11px] text-[#697d70]">
            Counts by current request status
          </div>
        </CardContent>
      </Card>

      {/* KPI Card 2: Staff Capacity & Availability */}
      <Card className="relative overflow-hidden bg-white">
        <div className="absolute -right-6 -top-6 size-24 rounded-full bg-[#faede4]/60 blur-xl" />
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#63796a]">
              Staff Capacity
            </span>
            <div className="grid size-9 place-items-center rounded-xl bg-[#faeee5] text-[#b45d34]">
              <Users size={18} />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-[#163a27]">
              {staffAvailabilityPct === null ? "—" : `${staffAvailabilityPct}%`}
            </span>
            <span className="text-xs text-[#708477]">on duty</span>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-xs text-[#526a5a]">
            <Badge variant="emerald" className="text-[10px] px-2 py-0">
              {data.availableStaffCount} available
            </Badge>
            <span>•</span>
            <span>{data.clinicianCount} clinicians</span>
            <span>•</span>
            <span>{data.counselorCount} counselors</span>
          </div>

          <div className="mt-4 border-t border-[#edf2ea] pt-3 text-[11px] text-[#697d70]">
            {data.activeStaffCount} active staff records
          </div>
        </CardContent>
      </Card>

      {/* KPI Card 3: Curriculum & Content Library */}
      <Card className="relative overflow-hidden bg-white">
        <div className="absolute -right-6 -top-6 size-24 rounded-full bg-[#e8eef3]/60 blur-xl" />
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#63796a]">
              Curriculum Health
            </span>
            <div className="grid size-9 place-items-center rounded-xl bg-[#e7edf3] text-[#34597b]">
              <BookOpen size={18} />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-[#163a27]">
              {data.publishedNotesCount}
            </span>
            <span className="text-xs text-[#708477]">live notes</span>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-xs text-[#526a5a]">
            <Badge variant="secondary" className="text-[10px] px-2 py-0">
              {data.draftNotesCount} drafts
            </Badge>
          </div>

          <div className="mt-4 border-t border-[#edf2ea] pt-3 text-[11px] text-[#697d70]">
            {data.publishedNotesCount + data.draftNotesCount} notes in library
          </div>
        </CardContent>
      </Card>

      {/* KPI Card 4: Consultations & Appointments */}
      <Card className="relative overflow-hidden bg-white">
        <div className="absolute -right-6 -top-6 size-24 rounded-full bg-[#f4e8df]/60 blur-xl" />
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#63796a]">
              Consultations
            </span>
            <div className="grid size-9 place-items-center rounded-xl bg-[#f5ede6] text-[#93522f]">
              <Calendar size={18} />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-[#163a27]">
              {data.upcomingAppointmentsCount}
            </span>
            <span className="text-xs text-[#708477]">upcoming</span>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-xs text-[#526a5a]">
            <Badge variant="info" className="text-[10px] px-2 py-0">
              {data.onlineAppointmentsCount} online
            </Badge>
            <span>•</span>
            <span>
              {Math.max(
                0,
                data.upcomingAppointmentsCount - data.onlineAppointmentsCount
              )}{" "}
              in-person
            </span>
          </div>

          <div className="mt-4 border-t border-[#edf2ea] pt-3 text-[11px] text-[#697d70]">
            Current scheduled appointments
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
