import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { approachSteps } from "./marketingContent";

export function ApproachSection() {
  return (
    <section
      id="approach"
      className="scroll-mt-20 bg-[#edf0e7] py-20 sm:py-28"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24 lg:px-12">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8a7550]">
            The Trinity approach
          </p>
          <h2 className="mt-4 max-w-lg text-4xl font-medium leading-[1.06] tracking-[-0.06em] text-[#193b2d] sm:text-5xl">
            Health information should feel human.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-[#66766a]">
            We make space for learning that is clear, culturally relevant, and
            respectful of each family&apos;s everyday experience.
          </p>
          <Link
            href="/notes"
            className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#24583e] transition hover:gap-3"
          >
            Discover Trinity
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="divide-y divide-[#d8dfd4] border-y border-[#d8dfd4]">
          {approachSteps.map((step) => (
            <article
              key={step.number}
              className="grid gap-3 py-6 sm:grid-cols-[56px_1fr] sm:gap-5 sm:py-7"
            >
              <span className="text-xs font-semibold tracking-[0.14em] text-[#8c9b88]">
                {step.number}
              </span>
              <div>
                <h3 className="text-lg font-semibold tracking-[-0.03em] text-[#294a36]">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-lg text-sm leading-6 text-[#6c7a70]">
                  {step.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
