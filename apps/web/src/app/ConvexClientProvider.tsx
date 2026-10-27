"use client";

import { type ReactNode } from "react";
import { useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL?.trim();
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  if (!convex) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7faf6] px-5 text-[#183b2d]">
        <section className="max-w-lg rounded-3xl border border-[#dce8de] bg-white p-8 text-center shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#438451]">
            TRINITY SETUP
          </p>
          <h1 className="mt-4 text-3xl font-semibold">
            The web client is not configured yet.
          </h1>
          <p className="mt-4 text-sm leading-7 text-[#68796d]">
            Add{" "}
            <code className="rounded bg-[#eef7ef] px-1.5 py-0.5 text-[#287343]">
              NEXT_PUBLIC_CONVEX_URL
            </code>{" "}
            to the web app environment, then reload this page.
          </p>
        </section>
      </main>
    );
  }

  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}
