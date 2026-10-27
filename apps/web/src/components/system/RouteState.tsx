import Link from "next/link";

export function RouteLoading({
  label = "Loading Trinity",
}: {
  label?: string;
}) {
  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-[#f7faf6] px-5 text-[#183b2d]">
      <div className="text-center">
        <div
          className="mx-auto h-10 w-10 animate-pulse rounded-full bg-[#c9dfcc]"
          aria-hidden="true"
        />
        <p className="mt-5 text-sm font-semibold text-[#5d7063]">{label}…</p>
      </div>
    </main>
  );
}

export function RouteError({
  title = "This page needs another try.",
  message = "Something interrupted this view. Please try again or return to the Trinity home page.",
}: {
  title?: string;
  message?: string;
}) {
  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-[#f7faf6] px-5 text-[#183b2d]">
      <div className="max-w-md text-center">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#438451]">
          TRINITY HEALTH SOLUTION
        </p>
        <h1 className="mt-4 text-3xl font-semibold">{title}</h1>
        <p className="mt-4 text-sm leading-7 text-[#68796d]">{message}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-full bg-[#287343] px-5 py-3 text-sm font-bold text-white"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-full border border-[#bcd4bf] bg-white px-5 py-3 text-sm font-bold text-[#287343]"
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
