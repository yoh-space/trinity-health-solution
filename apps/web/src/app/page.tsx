import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7faf6] text-[#183a25]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="text-xl font-semibold tracking-tight">TRINITY</span>
        <Link
          className="rounded-full bg-[#087a3d] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#056832]"
          href="/admin"
        >
          Publisher portal
        </Link>
      </nav>
      <section className="mx-auto grid max-w-6xl gap-12 px-6 pb-24 pt-16 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div>
          <p className="mb-5 text-sm font-bold tracking-[0.2em] text-[#087a3d]">
            የጤና ትምህርት · HEALTH LEARNING
          </p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-tight tracking-tight md:text-7xl">
            Everyday health knowledge, made clear for every family.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[#516259]">
            Trinity Health Solution brings trustworthy, practical learning into
            the hands of Ethiopian families—first in Amharic, always with care.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              className="rounded-full bg-[#087a3d] px-6 py-3 font-semibold text-white transition hover:bg-[#056832]"
              href="/admin"
            >
              Manage learning content
            </Link>
            <span className="rounded-full border border-[#bdd4c1] px-6 py-3 font-semibold text-[#365440]">
              Available in the Trinity mobile app
            </span>
          </div>
        </div>
        <div className="rounded-[2rem] bg-[#dcefe0] p-7 shadow-[0_24px_80px_rgba(23,68,38,0.12)]">
          <div className="rounded-[1.5rem] bg-white p-6">
            <p className="text-sm font-semibold text-[#087a3d]">THIS WEEK&apos;S FOCUS</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight">
              Small food choices can support strong family routines.
            </h2>
            <p className="mt-4 leading-7 text-[#5c6b62]">
              Clear, culturally relevant topics are published by Trinity staff
              and appear in the customer app when ready.
            </p>
            <div className="mt-8 flex items-center gap-3 text-sm font-medium text-[#087a3d]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#e6ae38]" />
              Reviewed learning, not clinical care
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
