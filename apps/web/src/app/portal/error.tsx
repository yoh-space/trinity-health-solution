"use client";

import { RouteError } from "@/components/system/RouteState";

export default function PortalError() {
  return (
    <RouteError
      title="Your portal needs another try."
      message="We could not load this client view. Please try again; no request or appointment was changed."
    />
  );
}
