import Link from "next/link";
import { Wordmark } from "./Wordmark";

export function MarketingFooter() {
  return (
    <footer className="border-t border-[#e8e8de]">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <Wordmark />
        <p className="text-xs leading-5 text-[#839087]">
          Health learning to support everyday wellbeing. Not a substitute for
          professional medical advice.
        </p>
        <Link
          href="/admin"
          className="text-xs font-semibold text-[#536b59] transition hover:text-[#1c573e]"
        >
          Publisher portal
        </Link>
      </div>
    </footer>
  );
}
