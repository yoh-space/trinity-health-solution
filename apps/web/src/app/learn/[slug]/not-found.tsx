import Link from "next/link";

export default function EducationNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fbfaf6] px-5 text-[#183b2d]">
      <section className="max-w-lg text-center">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#438451]">
          LEARNING NOTE
        </p>
        <h1 className="mt-4 text-4xl font-semibold">
          That note is not available.
        </h1>
        <p className="mt-4 text-sm leading-7 text-[#68796d]">
          The note may have been unpublished or the link may be out of date. The
          learning library has the latest published notes.
        </p>
        <Link
          href="/learn"
          className="mt-7 inline-block rounded-full bg-[#287343] px-5 py-3 text-sm font-bold text-white"
        >
          Back to learning library
        </Link>
      </section>
    </main>
  );
}
