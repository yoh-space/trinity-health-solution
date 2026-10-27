import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fbfaf6] px-5 text-[#183b2d]">
      <section className="max-w-lg text-center">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#438451]">
          TRINITY HEALTH SOLUTION
        </p>
        <h1 className="mt-4 text-4xl font-semibold">
          We could not find that page.
        </h1>
        <p className="mt-4 text-sm leading-7 text-[#68796d]">
          Try the learning library or return to the Trinity home page.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/learn"
            className="rounded-full bg-[#287343] px-5 py-3 text-sm font-bold text-white"
          >
            Open learning
          </Link>
          <Link
            href="/"
            className="rounded-full border border-[#bcd4bf] bg-white px-5 py-3 text-sm font-bold text-[#287343]"
          >
            Go home
          </Link>
        </div>
      </section>
    </main>
  );
}
