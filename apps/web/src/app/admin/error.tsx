"use client";

import { RouteError } from "@/components/system/RouteState";

export default function AdminError() {
  return (
    <RouteError
      title="The publisher desk needs another try."
      message="We could not load the content queue. Published family learning remains unchanged."
    />
  );
}
