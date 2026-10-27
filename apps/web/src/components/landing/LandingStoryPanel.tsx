import Image from "next/image";
import Link from "next/link";
import { BookOpen, ShieldCheck, Sprout } from "lucide-react";
import { PatternDivider } from "./PatternDivider";
import { storyCopy } from "./landingContent";

export function LandingStoryPanel() {
  return (
    <aside
      className="flex flex-col justify-between w-full max-w-[420px] min-h-[760px] py-4 lg:py-6"
      aria-label="About Trinity Health Solution"
    >
      <div>
        {/* Brand header */}
        <div className="flex items-center gap-3">
          <Image
            src="/images/trinity-mark.png"
            alt="Trinity Health Solution"
            width={48}
            height={48}
            className="h-11 w-auto object-contain"
            priority
          />
          <div>
            <h1 className="text-xl sm:text-[22px] font-bold text-[#1b492c] tracking-tight leading-none">
              Trinity Health Solution
            </h1>
            <span className="block text-[8.5px] font-bold tracking-[0.2em] text-[#5c7d5f] uppercase mt-1">
              {storyCopy.tagline}
            </span>
          </div>
        </div>

        {/* Edition Tag */}
        <div className="mt-10 sm:mt-12">
          <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.16em] text-[#0e7a33] uppercase">
            <span className="size-2 rounded-full bg-[#7dc21e] animate-pulse" />
            <span>{storyCopy.tagline}</span>
          </div>

          {/* Headline with serif italic emphasis */}
          <h2 className="mt-4 text-4xl sm:text-[46px] lg:text-[50px] font-bold text-[#14251a] leading-[1.08] tracking-[-0.03em]">
            {storyCopy.headlineFirst}
            <br />
            {storyCopy.headlineSecond}{" "}
            <em className="font-serif italic font-normal text-[#0e7a33]">
              {storyCopy.headlineEmphasis}
            </em>
          </h2>

          {/* Description */}
          <p className="mt-5 text-sm sm:text-[15px] leading-relaxed text-[#4b5c51]">
            {storyCopy.description}
          </p>

          {/* Decorative woven pattern divider */}
          <div className="my-6">
            <PatternDivider variant="subtle" />
          </div>

          {/* Story Values */}
          <div className="space-y-3.5 text-sm">
            <div className="flex items-center gap-3 text-[#14221a]">
              <Sprout className="size-[18px] text-[#2f8f4e] shrink-0" aria-hidden="true" />
              <span className="font-medium text-[#203127]">
                {storyCopy.commitments[0]}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[#14221a]">
              <BookOpen className="size-[18px] text-[#2f8f4e] shrink-0" aria-hidden="true" />
              <span className="font-medium text-[#203127]">
                {storyCopy.commitments[1]}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[#14221a]">
              <ShieldCheck className="size-[18px] text-[#2f8f4e] shrink-0" aria-hidden="true" />
              <span className="font-medium text-[#203127]">
                {storyCopy.commitments[2]}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer area */}
      <div className="mt-8 pt-4">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border-[1.5px] border-[#0e7a33] bg-white/80 hover:bg-[#e8f5ec] text-[#0e7a33] text-[13px] font-semibold transition shadow-sm backdrop-blur"
        >
          <ShieldCheck className="size-4 shrink-0" aria-hidden="true" />
          <span>{storyCopy.portal}</span>
        </Link>

        <div className="mt-8 space-y-0.5">
          <p className="text-[15px] font-semibold text-[#0e7a33]">
            {storyCopy.amharicNote}
          </p>
          <p className="text-xs text-[#5c7263] italic">
            {storyCopy.englishNote}
          </p>
        </div>
      </div>
    </aside>
  );
}
