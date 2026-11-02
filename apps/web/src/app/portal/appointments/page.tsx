import Link from "next/link";
import { ArrowLeft, Calendar, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Appointments & Visits | Client Portal | Trinity Health Solution",
};

export default function PortalAppointmentsPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <Link
        href="/portal"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1c573e] hover:underline"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        <span>Back to Portal Overview</span>
      </Link>

      <div className="rounded-3xl border border-[#dce8de] bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center border-b border-[#e2eae1] pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1c573e]">
                SCHEDULED SESSIONS
              </span>
              <span className="text-[#cbd6cc]">•</span>
              <span className="text-xs text-[#6e8574]">Clinical & Nutrition</span>
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#163826]">
              Appointments & Consultations
            </h1>
          </div>
          <span className="rounded-full bg-[#eaf4eb] px-3 py-1 text-xs font-bold text-[#1c573e] self-start sm:self-auto">
            1 Upcoming
          </span>
        </div>

        <div className="mt-6 space-y-4">
          <div className="rounded-2xl border border-[#cbe0ce] bg-[#f5faf6] p-5 flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
            <div className="flex items-start gap-3.5">
              <div className="grid size-11 place-items-center rounded-xl bg-[#1c573e] text-white shrink-0">
                <Calendar size={20} />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1c573e]">
                  Virtual Health Guidance
                </span>
                <h2 className="text-base font-bold text-[#163826]">
                  Pregnancy & Breastfeeding Nutrition Review
                </h2>
                <p className="text-xs text-[#5d7364] mt-0.5">
                  Thursday, 14:30 EAT · With Dr. Almaz Bekele (Maternal Health)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-800">
                Confirmed
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
