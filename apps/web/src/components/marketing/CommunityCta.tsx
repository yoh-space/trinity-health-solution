import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CommunityCta() {
  return (
    <section
      id="community"
      className="scroll-mt-20 mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-12"
    >
      <div className="relative overflow-hidden rounded-[2rem] bg-[#1c573e] px-6 py-10 text-white sm:rounded-[2.5rem] sm:px-12 sm:py-14 lg:px-16">
        <div className="pointer-events-none absolute -right-20 -top-40 size-96 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-4 -top-24 size-64 rounded-full border border-white/10" />
        <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d9c99f]">
              For families & publishers
            </p>
            <h2 className="mt-4 max-w-2xl text-3xl font-medium leading-tight tracking-[-0.055em] sm:text-5xl">
              Better health learning, shared together.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-[#d4e1d6] sm:text-base">
              Explore learning in the app, or use the publisher portal to
              manage content for your community.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link
              href="/notes"
              className="inline-flex items-center gap-2 rounded-full bg-[#f3e8c9] px-5 py-3 text-sm font-semibold text-[#244a35] transition hover:bg-white"
            >
              Open the app
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Publisher portal
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
