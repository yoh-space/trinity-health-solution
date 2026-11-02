"use client";

import {
  Stethoscope,
  Users,
  BookOpen,
  Calendar,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

export interface KpiOverviewData {
  totalCareRequests: number;
  clinicalRequests: number;
  counsellingRequests: number;
  submittedBacklog: number;
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
      : 100;

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
            <span className="text-xs text-[#708477]">active requests</span>
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

          <div className="mt-4 flex items-center justify-between border-t border-[#edf2ea] pt-3 text-[11px] text-[#697d70]">
            <span className="flex items-center gap-1 text-[#227242] font-semibold">
              <TrendingUp size={13} />
              +14% this week
            </span>
            <span>All-time synced</span>
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
              {staffAvailabilityPct}%
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

          <div className="mt-4 flex items-center justify-between border-t border-[#edf2ea] pt-3 text-[11px] text-[#697d70]">
            <span className="flex items-center gap-1 text-[#227242] font-semibold">
              <ShieldCheck size={13} />
              Triage coverage active
            </span>
            <span>{data.activeStaffCount} total staff</span>
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
            <span>•</span>
            <span>100% Amharic-first</span>
            <span>•</span>
            <span>UNICEF-aligned</span>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-[#edf2ea] pt-3 text-[11px] text-[#697d70]">
            <span className="text-[#34597b] font-semibold">Web & Mobile live</span>
            <span>5 core categories</span>
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

          <div className="mt-4 flex items-center justify-between border-t border-[#edf2ea] pt-3 text-[11px] text-[#697d70]">
            <span className="flex items-center gap-1 text-[#227242] font-semibold">
              <Clock size={13} />
              Avg 30m duration
            </span>
            <span>Active schedule</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
