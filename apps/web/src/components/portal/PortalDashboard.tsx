"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";

export function PortalDashboard() {
  const { user } = useUser();
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#438451]">
            YOUR CARE SPACE
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Good day, {user?.firstName ?? "there"}.
          </h1>
          <p className="mt-3 text-[#68796d]">
            A simple place to keep learning, requests, and appointments
            together.
          </p>
        </div>
        <Link
          href="/portal/consultations/new"
          className="rounded-full bg-[#287343] px-5 py-3 text-sm font-bold text-white"
        >
          Request support
        </Link>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        <SummaryCard
          label="Open request"
          value="1"
          detail="Waiting for a team member"
        />
        <SummaryCard
          label="Next appointment"
          value="Thu 14:30"
          detail="Online · Nutrition"
        />
        <SummaryCard
          label="Saved learning"
          value="4"
          detail="Notes to revisit"
        />
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-[#dce8de] bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your next step</h2>
            <span className="rounded-full bg-[#fff4d9] px-3 py-1 text-xs font-bold text-[#8a641a]">
              New request
            </span>
          </div>
          <p className="mt-4 text-sm leading-7 text-[#68796d]">
            Tell the Trinity team what kind of general support would be useful.
            You do not need to share personal health details in this first
            request.
          </p>
          <Link
            href="/portal/consultations/new"
            className="mt-6 inline-block rounded-full bg-[#eaf4eb] px-4 py-2.5 text-sm font-bold text-[#287343]"
          >
            <span className="inline-flex items-center gap-2">
              Start a request <ArrowRight size={15} aria-hidden="true" />
            </span>
          </Link>
        </section>
        <section className="rounded-3xl bg-[#173e27] p-6 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a7d9af]">
            KEEP LEARNING
          </p>
          <h2 className="mt-3 text-2xl font-semibold">
            A little note for today.
          </h2>
          <p className="mt-3 text-sm leading-7 text-[#c7ddcb]">
            Explore practical family education, then save what feels useful for
            another day.
          </p>
          <Link
            href="/learn"
            className="mt-6 inline-block rounded-full bg-white px-4 py-2.5 text-sm font-bold text-[#173e27]"
          >
            Open learning library
          </Link>
        </section>
      </div>
    </>
  );
}

function SummaryCard({
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
