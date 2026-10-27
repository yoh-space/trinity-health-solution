"use client";

import { RouteError } from "@/components/system/RouteState";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteError
      title="Trinity needs another try."
      message="The page could not finish loading. Your account and saved work are unchanged."
    />
  );
}
