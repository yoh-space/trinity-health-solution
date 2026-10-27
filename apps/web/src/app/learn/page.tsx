import Link from "next/link";
import { EducationLibrary } from "@/components/education/EducationLibrary";

export const metadata = { title: "Learning library | Trinity Health Solution" };

export default function LearnPage() {
  return (
    <>
      <header className="border-b border-[#183b2d]/10 bg-[#fbfaf6]">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
          <Link href="/" className="text-lg font-semibold text-[#23472e]">
            Trinity Health Solution
          </Link>
          <div className="flex items-center gap-4 text-sm font-semibold text-[#52705b]">
            <Link href="/ask-opal">Ask Opal</Link>
            <Link
              href="/admin"
              className="rounded-full bg-[#287343] px-4 py-2 text-white"
            >
              Publisher portal
            </Link>
          </div>
        </nav>
      </header>
      <EducationLibrary />
    </>
  );
}
