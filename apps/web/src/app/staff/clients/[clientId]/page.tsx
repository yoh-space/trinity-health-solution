import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function StaffClientPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  return (
    <section>
      <Link href="/staff/clients" className="text-sm font-bold text-[#438451]">
        <span className="inline-flex items-center gap-2">
          <ArrowLeft size={15} aria-hidden="true" />
          Back to clients
        </span>
      </Link>
      <div className="mt-10 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#438451]">
            CLIENT SUMMARY · {clientId}
          </p>
          <h1 className="mt-3 text-4xl font-semibold">Selam Tesfaye</h1>
          <p className="mt-3 text-[#68796d]">
            Preferred language: English · Assigned to your desk
          </p>
        </div>
        <span className="rounded-full bg-[#e7f2e9] px-3 py-1.5 text-xs font-bold text-[#397047]">
          Active
        </span>
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-[#dce8de] bg-white p-6">
          <h2 className="text-xl font-semibold">Open request</h2>
          <p className="mt-4 text-sm leading-7 text-[#68796d]">
            Pregnancy & breastfeeding nutrition · Online · New request
          </p>
          <button
            type="button"
            className="mt-6 rounded-full bg-[#287343] px-4 py-2.5 text-sm font-bold text-white"
          >
            Assign to me
          </button>
        </section>
        <section className="rounded-3xl border border-[#dce8de] bg-white p-6">
          <h2 className="text-xl font-semibold">Notes</h2>
          <p className="mt-4 text-sm leading-7 text-[#68796d]">
            No shared consultation notes yet. Internal notes will be connected
            to Convex with role-based visibility.
          </p>
        </section>
      </div>
    </section>
  );
}
