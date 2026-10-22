import {
  ArrowDownRight,
  ArrowRight,
  Heart,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

function FamilyIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-[590px] lg:ml-auto">
      <div className="absolute -left-5 top-10 size-24 rounded-full bg-[#e9d6a8]/60 blur-2xl sm:-left-10 sm:size-36" />
      <div className="absolute -bottom-8 right-4 size-32 rounded-full bg-[#b9c8a9]/60 blur-3xl" />
      <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-[#e9eee3] p-4 shadow-[0_30px_90px_rgba(39,68,48,0.12)] sm:rounded-[2.5rem] sm:p-6">
        <div className="relative min-h-[370px] overflow-hidden rounded-[1.5rem] bg-[#dfe8da] sm:min-h-[470px] sm:rounded-[2rem]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_15%,rgba(255,255,255,0.85),transparent_45%),linear-gradient(145deg,#eaf0e4_5%,#d8e4d4_100%)]" />
          <div className="absolute -right-14 -top-14 size-64 rounded-full border border-[#b9c9b5]/60 sm:size-80" />
          <div className="absolute -right-2 top-0 size-52 rounded-full border border-[#b9c9b5]/50 sm:size-64" />
          <div className="absolute bottom-0 left-0 h-40 w-full bg-[linear-gradient(0deg,rgba(108,135,103,0.12),transparent)]" />

          <div className="absolute left-5 top-5 z-10 flex items-center gap-2 rounded-full bg-white/75 px-3 py-2 text-[11px] font-semibold text-[#45604a] backdrop-blur sm:left-8 sm:top-8">
            <Sparkles size={13} aria-hidden="true" />
            A moment to learn
          </div>
          <div className="absolute right-5 top-20 z-10 hidden rotate-6 rounded-2xl bg-[#c37c57] px-4 py-3 text-xs font-medium text-white shadow-lg sm:block">
            Small steps,
            <br />
            lasting habits.
          </div>

          <div className="absolute bottom-[-4px] left-1/2 flex h-[275px] w-[250px] -translate-x-1/2 items-end justify-center sm:h-[335px] sm:w-[305px]">
            <div className="absolute bottom-0 h-[190px] w-[240px] rounded-t-[48%] bg-[#bd916f] sm:h-[225px] sm:w-[290px]" />
            <div className="absolute bottom-0 left-8 h-[158px] w-[102px] -rotate-6 rounded-t-[48%] bg-[#476c52] sm:left-10 sm:h-[188px] sm:w-[122px]" />
            <div className="absolute bottom-0 right-8 h-[163px] w-[108px] rotate-6 rounded-t-[48%] bg-[#c17e5d] sm:right-10 sm:h-[193px] sm:w-[130px]" />
            <div className="absolute bottom-[111px] left-[61px] z-10 size-[74px] rounded-full bg-[#5d382c] sm:bottom-[140px] sm:left-[72px] sm:size-[88px]" />
            <div className="absolute bottom-[115px] right-[59px] z-10 size-[74px] rounded-full bg-[#6d4838] sm:bottom-[145px] sm:right-[70px] sm:size-[88px]" />
            <div className="absolute bottom-0 left-1/2 z-20 h-[175px] w-[84px] -translate-x-1/2 rounded-t-[42%] bg-[#e4c98d] sm:h-[208px] sm:w-[100px]" />
            <div className="absolute bottom-[150px] left-1/2 z-30 size-[82px] -translate-x-1/2 rounded-full bg-[#875b44] sm:bottom-[186px] sm:size-[98px]" />
            <div className="absolute bottom-[195px] left-1/2 z-30 h-[28px] w-[88px] -translate-x-1/2 rounded-[50%_50%_35%_35%] bg-[#253c30] sm:bottom-[239px] sm:h-[32px] sm:w-[104px]" />
            <div className="absolute bottom-[76px] left-1/2 z-40 h-[77px] w-[66px] -translate-x-1/2 rotate-[-9deg] rounded-lg border-[5px] border-[#f5f0e2] bg-[#f8f4e9] shadow-md sm:bottom-[91px] sm:h-[94px] sm:w-[80px]">
              <div className="mx-auto mt-4 h-1 w-7 rounded-full bg-[#7d9a74] sm:w-9" />
              <div className="mx-auto mt-2 h-1 w-9 rounded-full bg-[#d1d9ca] sm:w-11" />
              <div className="mx-auto mt-2 h-1 w-6 rounded-full bg-[#d1d9ca] sm:w-8" />
            </div>
          </div>

          <div className="absolute bottom-5 left-5 z-10 rounded-2xl border border-white/80 bg-white/85 p-4 shadow-[0_12px_28px_rgba(42,70,48,0.1)] backdrop-blur sm:bottom-8 sm:left-8 sm:p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#84917f]">
              This week&apos;s focus
            </p>
            <p className="mt-1.5 text-sm font-semibold text-[#244733] sm:text-base">
              Healthy everyday choices
            </p>
            <div className="mt-3 flex items-center gap-2 text-[11px] text-[#718075]">
              <ShieldCheck
                size={14}
                className="text-[#66815e]"
                aria-hidden="true"
              />
              Reviewed learning, not clinical care
            </div>
          </div>
          <div className="absolute bottom-7 right-6 z-10 grid size-11 place-items-center rounded-full bg-[#f4e5c1] text-[#765f32] shadow-md sm:bottom-10 sm:right-9 sm:size-14">
            <Heart size={21} strokeWidth={1.7} aria-hidden="true" />
          </div>
        </div>
      </div>
      <div className="absolute -bottom-5 right-4 rounded-full border border-[#e7e4d8] bg-[#fbfaf6] px-4 py-2 text-xs font-medium text-[#65746a] shadow-sm sm:-right-4 sm:bottom-9">
        Made with care, for everyday life
      </div>
    </div>
  );
}

export function MarketingHero() {
  return (
    <section className="relative">
      <div className="pointer-events-none absolute -right-36 -top-24 size-[540px] rounded-full border border-[#dfe5d8] sm:-right-24 sm:top-[-150px] sm:size-[760px]" />
      <div className="pointer-events-none absolute -right-16 top-16 size-[390px] rounded-full border border-[#e8ebdf] sm:right-[-3rem] sm:top-[-3rem] sm:size-[600px]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:px-12 lg:pb-32 lg:pt-28">
        <div className="relative z-10">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#dce4d8] bg-white/75 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#44634d]">
            <span className="size-1.5 rounded-full bg-[#c78157]" />
            የጤና ትምህርት · Health learning
          </div>
          <h1 className="max-w-[720px] text-[clamp(3.25rem,7vw,6.5rem)] font-medium leading-[0.98] tracking-[-0.075em] text-[#193b2d]">
            A little more
            <br />
            <span className="font-serif italic text-[#718469]">
              well-informed.
            </span>
            <br />
            Every day.
          </h1>
          <p className="mt-7 max-w-[560px] text-base leading-7 text-[#65746a] sm:mt-8 sm:text-lg sm:leading-8">
            Clear, practical health learning for Ethiopian families—first in
            Amharic, made to feel useful in everyday life.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3.5">
            <Link
              href="/notes"
              className="inline-flex items-center gap-3 rounded-full bg-[#1c573e] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(28,87,62,0.16)] transition hover:-translate-y-0.5 hover:bg-[#164832]"
            >
              Explore the app
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link
              href="#approach"
              className="inline-flex items-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold text-[#3d5a48] transition hover:bg-white"
            >
              Get to know us
              <ArrowDownRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-11 flex items-center gap-3 text-sm text-[#708075]">
            <span className="flex -space-x-2">
              <span className="grid size-8 place-items-center rounded-full border-2 border-[#fbfaf6] bg-[#e6d9c5] text-[10px] font-semibold text-[#6d5940]">
                አ
              </span>
              <span className="grid size-8 place-items-center rounded-full border-2 border-[#fbfaf6] bg-[#dce7d8] text-[10px] font-semibold text-[#476742]">
                T
              </span>
              <span className="grid size-8 place-items-center rounded-full border-2 border-[#fbfaf6] bg-[#f2ded1] text-[10px] font-semibold text-[#9b593e]">
                ✳
              </span>
            </span>
            <span>Learning shaped around families and community</span>
          </div>
        </div>
        <FamilyIllustration />
      </div>
    </section>
  );
}
