import Link from "next/link";

export default function StaffTeamPage() {
  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#438451]">
        ADMINISTRATION
      </p>
      <h1 className="mt-3 text-4xl font-semibold">Team access</h1>
      <p className="mt-3 max-w-2xl text-[#68796d]">
        The admin team workspace will manage staff roles, active assignments,
        and publisher access. Role changes remain intentionally disabled until
        the persistent staff profile model is connected.
      </p>
      <div className="mt-8 rounded-3xl border border-dashed border-[#bed2c1] bg-white p-8">
        <p className="text-sm leading-7 text-[#6b7d70]">
          Current staff access is controlled through Clerk metadata and the
          existing publisher allowlist. The next backend phase will make these
          permissions auditable in Convex.
        </p>
        <Link
          href="/admin"
          className="mt-5 inline-block rounded-full bg-[#287343] px-5 py-3 text-sm font-bold text-white"
        >
          Open publisher CMS
        </Link>
      </div>
    </section>
  );
}
