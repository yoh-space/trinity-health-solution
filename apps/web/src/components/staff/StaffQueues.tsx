"use client";

import Link from "next/link";
import { demoRequests, statusStyles } from "@/lib/portal";

export function StaffRequests() {
  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#438451]">
        CARE OPERATIONS
      </p>
      <h1 className="mt-3 text-4xl font-semibold">Request queue</h1>
      <p className="mt-3 text-[#68796d]">
        Review general support requests and decide what needs a colleague’s
        attention.
      </p>
      <div className="mt-8 grid gap-3">
        {demoRequests.map((request) => (
          <article
            key={request.id}
            className="flex flex-wrap items-center justify-between gap-5 rounded-3xl border border-[#dce8de] bg-white p-6"
          >
            <div>
              <p className="text-xs font-bold tracking-[0.12em] text-[#579165]">
                {request.id} · {request.created}
              </p>
              <h2 className="mt-2 text-lg font-semibold">{request.type}</h2>
              <p className="mt-2 text-sm text-[#7a887d]">
                {request.client} · {request.format}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyles[request.status]}`}
              >
                {request.status}
              </span>
              <button
                type="button"
                className="rounded-full bg-[#eaf4eb] px-4 py-2 text-sm font-bold text-[#287343]"
              >
                Assign
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function StaffClients() {
  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#438451]">
        CLIENTS
      </p>
      <h1 className="mt-3 text-4xl font-semibold">Assigned clients</h1>
      <p className="mt-3 text-[#68796d]">
        Keep a focused view of the families currently connected to this desk.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          "Selam Tesfaye",
          "Mekdes A.",
          "Hana K.",
          "Rahel M.",
          "Abel T.",
          "Liya K.",
        ].map((name, index) => (
          <Link
            href={`/staff/clients/${index + 1}`}
            key={name}
            className="rounded-3xl border border-[#dce8de] bg-white p-6 hover:border-[#87b791]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eaf4eb] font-semibold text-[#287343]">
              {name.slice(0, 1)}
            </div>
            <h2 className="mt-5 font-semibold">{name}</h2>
            <p className="mt-2 text-sm text-[#7a887d]">
              {index % 2 === 0
                ? "Nutrition consultation"
                : "Family learning follow-up"}
            </p>
            <span className="mt-5 inline-block text-sm font-bold text-[#438451]">
              View summary →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function StaffAppointments() {
  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#438451]">
        CALENDAR
      </p>
      <h1 className="mt-3 text-4xl font-semibold">Appointments</h1>
      <div className="mt-8 grid gap-4">
        <div className="rounded-3xl border border-[#c9dfcc] bg-[#eaf4eb] p-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#438451]">
            THURSDAY · 14:30
          </p>
          <h2 className="mt-3 text-xl font-semibold">
            Pregnancy & breastfeeding nutrition
          </h2>
          <p className="mt-2 text-sm text-[#5f7665]">
            Selam Tesfaye · Online · Confirmed
          </p>
        </div>
        <div className="rounded-3xl border border-[#dce8de] bg-white p-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#829086]">
            FRIDAY · 10:00
          </p>
          <h2 className="mt-3 text-xl font-semibold">Family meal planning</h2>
          <p className="mt-2 text-sm text-[#7a887d]">
            Mekdes A. · In person · Proposed
          </p>
        </div>
      </div>
    </section>
  );
}
