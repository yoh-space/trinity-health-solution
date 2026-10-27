"use client";

import { RouteError } from "@/components/system/RouteState";

export default function LearnError() {
  return (
    <RouteError
      title="The learning library is taking a pause."
      message="Please try again. Published notes remain available in the mobile app while this page reconnects."
    />
  );
}
