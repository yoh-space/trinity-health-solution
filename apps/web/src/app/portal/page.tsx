import { Suspense } from "react";
import { PortalDashboard } from "@/components/portal/PortalDashboard";

export const metadata = { title: "Client Care Portal | Trinity Health Solution" };

export default function PortalPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="size-8 animate-spin rounded-full border-2 border-[#1c573e] border-t-transparent" />
        </div>
      }
    >
      <PortalDashboard />
    </Suspense>
  );
}
