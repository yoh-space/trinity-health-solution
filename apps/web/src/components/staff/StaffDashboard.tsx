"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { demoRequests, statusStyles } from "@/lib/portal";

export function StaffDashboard() {
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
  const isAdmin =
    userEmail === "yohansdam@gmail.com" ||
    userEmail === "yashaknike@gmail.com" ||
    user?.publicMetadata?.role === "admin";
  const role = isAdmin ? "admin" : String(user?.publicMetadata?.role ?? "counselor");
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#438451]">
            {role.toUpperCase()} DESK
          </p>
          <h1 className="mt-3 text-4xl font-semibold">
            Good day, {user?.firstName ?? "team member"}.
          </h1>
          <p className="mt-3 text-[#68796d]">
            A calm queue for the people helping families feel well.
          </p>
        </div>
        <Link
          href="/staff/requests"
          className="rounded-full bg-[#287343] px-5 py-3 text-sm font-bold text-white"
        >
          Open request queue
        </Link>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        <Metric label="New requests" value="2" detail="Need a first look" />
        <Metric label="Today" value="1" detail="Session at 14:30" />
        <Metric label="Assigned clients" value="8" detail="Across your desk" />
      </div>
      <section className="mt-10 rounded-3xl border border-[#dce8de] bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Latest requests</h2>
          <Link
            href="/staff/requests"
            className="text-sm font-bold text-[#438451]"
          >
            See all
          </Link>
        </div>
        <div className="mt-5 grid gap-3">
          {demoRequests.map((request) => (
            <div
              key={request.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#e1ebe2] p-4"
            >
              <div>
                <p className="text-xs font-bold tracking-[0.12em] text-[#579165]">
                  {request.id} · {request.created}
                </p>
                <h3 className="mt-2 font-semibold text-[#2e4434]">
                  {request.type}
                </h3>
                <p className="mt-1 text-sm text-[#7a887d]">
                  {request.client} · {request.format}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyles[request.status]}`}
              >
                {request.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
function Metric({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-3xl border border-[#dce8de] bg-white p-5">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6e8273]">
        {label}
      </p>
      <p className="mt-4 text-3xl font-semibold text-[#245d37]">{value}</p>
      <p className="mt-2 text-sm text-[#7b8b80]">{detail}</p>
    </div>
  );
}
