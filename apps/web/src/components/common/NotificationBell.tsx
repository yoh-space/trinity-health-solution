"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import { Bell, CheckCircle2 } from "lucide-react";

type Count = number | "100+";

type QueueCounts = {
  submitted: Count;
  inReview: Count;
  contacted: Count;
  closed: Count;
};

function addCounts(first: Count, second: Count) {
  return first === "100+" || second === "100+" ? "100+" : first + second;
}

function numericCount(value: Count | undefined) {
  return value === "100+" ? 100 : value ?? 0;
}

export function NotificationBell({ scope }: { scope: "client" | "staff" | "admin" }) {
  const { user, isLoaded } = useUser();
  const [open, setOpen] = useState(false);
  const [dismissedCount, setDismissedCount] = useState(0);
  const previousCount = useRef(0);
  const role = user?.publicMetadata?.role;
  const isStaff = scope !== "client";

  const clientRequests = useQuery(anyApi.careRequests.listMine, isLoaded && !isStaff ? {} : "skip") as
    | Array<{ status: "submitted" | "inReview" | "contacted" | "closed" }>
    | undefined;
  const adminOverview = useQuery(
    anyApi.careRequests.getAdminDashboardOverview,
    isLoaded && (scope === "admin" || (scope === "staff" && role === "admin")) ? {} : "skip",
  ) as { counts: { clinical: QueueCounts; counselling: QueueCounts } } | undefined;
  const clinicalCounts = useQuery(
    anyApi.careRequests.getClinicalQueueCounts,
    isLoaded && scope === "staff" && role === "clinician" ? {} : "skip",
  ) as QueueCounts | undefined;
  const counselorCounts = useQuery(
    anyApi.careRequests.getCounselorQueueCounts,
    isLoaded && scope === "staff" && role === "counselor" ? {} : "skip",
  ) as QueueCounts | undefined;

  const count = adminOverview
    ? addCounts(
        addCounts(adminOverview.counts.clinical.submitted, adminOverview.counts.clinical.inReview),
        addCounts(adminOverview.counts.counselling.submitted, adminOverview.counts.counselling.inReview),
      )
    : clinicalCounts
      ? addCounts(clinicalCounts.submitted, clinicalCounts.inReview)
      : counselorCounts
        ? addCounts(counselorCounts.submitted, counselorCounts.inReview)
        : clientRequests
          ? clientRequests.filter((request) => request.status !== "closed").length
          : 0;
  const rawCount = numericCount(count);

  useEffect(() => {
    if (rawCount < previousCount.current) {
      setDismissedCount(0);
    }
    previousCount.current = rawCount;
  }, [rawCount]);

  const visibleCount = Math.max(0, rawCount - dismissedCount);
  const displayCount = visibleCount >= 100 ? "99+" : String(visibleCount);
  const hasNotifications = visibleCount > 0;
  const destination = scope === "admin" ? "/admin" : scope === "staff" ? "/staff/requests" : "/portal?tab=requests";
  const message = isStaff
    ? `${displayCount} care request${visibleCount === 1 ? "" : "s"} need${visibleCount === 1 ? "s" : ""} attention.`
    : `${displayCount} active care question${visibleCount === 1 ? "" : "s"}.`;

  function dismissNotification() {
    setDismissedCount((current) => Math.min(current + 1, rawCount));
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="relative grid size-9 place-items-center rounded-xl border border-[#d2ddd0] bg-white text-[#2a4c37] transition hover:bg-[#f2f7f1]"
        aria-label={hasNotifications ? `${displayCount} new notifications` : "Notifications"}
        aria-expanded={open}
      >
        <Bell size={17} />
        {hasNotifications && (
          <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-red-600 px-1 text-center text-[9px] font-bold leading-4 text-white shadow-sm">
            {displayCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-72 rounded-2xl border border-[#dce6dc] bg-white p-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#edf2ec] px-2 pb-2">
            <h2 className="text-sm font-bold text-[#193a27]">Notifications</h2>
            {hasNotifications && <span className="text-[10px] font-bold uppercase text-red-600">New</span>}
          </div>
          {hasNotifications ? (
            <Link
              href={destination}
              onClick={dismissNotification}
              className="mt-2 block rounded-xl border border-red-100 bg-red-50 p-3 hover:bg-red-100"
            >
              <p className="text-xs font-bold text-red-800">{message}</p>
              <p className="mt-1 text-[11px] text-red-700">Open to see what needs your attention.</p>
            </Link>
          ) : (
            <div className="flex items-center gap-2 px-2 py-4 text-xs text-[#657a6b]">
              <CheckCircle2 size={15} className="text-[#287343]" />
              You are all caught up.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
