"use client";

import { RouteError } from "@/components/system/RouteState";

export default function StaffError() {
  return (
    <RouteError
      title="The staff desk needs another try."
      message="The workspace did not load completely. Please try again; no client record was changed."
    />
  );
}
