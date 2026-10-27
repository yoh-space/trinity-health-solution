import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PortalAppointmentsPage() {
  return (
    <section>
      <Link href="/portal" className="text-sm font-bold text-[#438451]">
        <span className="inline-flex items-center gap-2">
          <ArrowLeft size={15} aria-hidden="true" />
          Back to portal
        </span>
      </Link>
      <h1 className="mt-10 text-4xl font-semibold">Appointments</h1>
      <p className="mt-3 text-[#68796d]">
        Your confirmed and proposed conversations with the Trinity team.
      </p>
      <div className="mt-8 rounded-3xl border border-[#c9dfcc] bg-[#eaf4eb] p-6">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#438451]">
          THURSDAY · 14:30
        </p>
        <h2 className="mt-3 text-xl font-semibold">
          Pregnancy & breastfeeding nutrition
        </h2>
        <p className="mt-2 text-sm text-[#5f7665]">Online · Confirmed</p>
      </div>
    </section>
  );
}
