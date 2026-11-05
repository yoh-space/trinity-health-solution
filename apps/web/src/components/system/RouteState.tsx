import Link from "next/link";
import Image from "next/image";

export function TrinityLoading({ label = "Loading Trinity" }: { label?: string }) {
  return (
    <main className="flex min-h-[60vh] items-center justify-center overflow-hidden bg-[#f7faf6] px-5 text-[#183b2d]">
      <div className="w-full max-w-sm text-center" role="status" aria-live="polite">
        <div className="relative mx-auto grid size-32 place-items-center">
          <div className="absolute inset-0 rounded-full border border-[#bcd9c2]" aria-hidden="true" />
          <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-[#287343] border-r-[#82b58c] animate-spin" aria-hidden="true" />
          <div className="absolute inset-5 rounded-full border border-[#d8e9d8]" aria-hidden="true" />
          <div className="relative grid size-20 place-items-center rounded-full bg-white shadow-[0_8px_28px_rgba(28,87,62,0.12)]">
            <Image
              src="/images/logo-trinity-web.png"
              alt=""
              width={104}
              height={34}
              priority
              className="h-auto w-16 object-contain"
            />
          </div>
        </div>

        <div className="mt-6 overflow-hidden whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.32em] text-[#287343]">
          <div className="inline-flex min-w-max animate-[trinity-marquee_9s_linear_infinite] gap-8" aria-hidden="true">
            <span>TRINITY HEALTH SOLUTION</span>
            <span>TRINITY HEALTH SOLUTION</span>
            <span>TRINITY HEALTH SOLUTION</span>
          </div>
        </div>
        <p className="mt-3 text-xs font-semibold text-[#68796d]">{label}…</p>
        <style jsx>{`
          @keyframes trinity-marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-33.333%); }
          }
          @media (prefers-reduced-motion: reduce) {
            .animate-\[trinity-marquee_9s_linear_infinite\] { animation: none; }
          }
        `}</style>
      </div>
    </main>
  );
}

export function RouteLoading({
  label = "Loading Trinity",
}: {
  label?: string;
}) {
  return <TrinityLoading label={label} />;
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
