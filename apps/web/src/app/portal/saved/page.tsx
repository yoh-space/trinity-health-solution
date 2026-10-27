import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PortalSavedPage() {
  return (
    <section>
      <Link href="/portal" className="text-sm font-bold text-[#438451]">
        <span className="inline-flex items-center gap-2">
          <ArrowLeft size={15} aria-hidden="true" />
          Back to portal
        </span>
      </Link>
      <h1 className="mt-10 text-4xl font-semibold">Saved learning</h1>
      <p className="mt-3 text-[#68796d]">
        Keep useful notes close as you build everyday family knowledge.
      </p>
      <div className="mt-8 rounded-3xl border border-dashed border-[#bed2c1] bg-white p-10 text-center">
        <p className="text-[#6b7d70]">
          Saved items from the public library will appear here. Persistent
          saving will be connected to Convex in the next data phase.
        </p>
        <Link
          href="/learn"
          className="mt-5 inline-block rounded-full bg-[#287343] px-5 py-3 text-sm font-bold text-white"
        >
          Browse learning
        </Link>
      </div>
    </section>
  );
}
