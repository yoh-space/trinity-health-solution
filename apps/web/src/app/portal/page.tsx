import { Suspense } from "react";
import { PortalDashboard } from "@/components/portal/PortalDashboard";
import { TrinityLoading } from "@/components/system/RouteState";

export const metadata = { title: "Client Care Portal | Trinity Health Solution" };

export default function PortalPage() {
  return (
    <Suspense
      fallback={<TrinityLoading label="Opening your care space" />}
    >
      <PortalDashboard />
    </Suspense>
  );
}
