import { ArrowRight } from "lucide-react";
import { learningTopics } from "./marketingContent";

export function LearningTopicsSection() {
  return (
    <section
      id="learning"
      className="scroll-mt-20 mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-12"
    >
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8a7550]">
            Learning for real life
          </p>
          <h2 className="mt-4 max-w-xl text-4xl font-medium leading-[1.06] tracking-[-0.06em] text-[#193b2d] sm:text-5xl">
            Good health starts with understanding.
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-6 text-[#6c7a70] sm:pb-1">
          Explore thoughtful, easy-to-follow learning designed around the
          questions and routines that matter to families.
        </p>
      </div>
      <div className="mt-11 grid gap-4 md:grid-cols-3">
        {learningTopics.map(({ number, title, description, icon: Icon, tint }) => (
          <article
            key={number}
            className="group rounded-[1.5rem] border border-[#e8e9df] bg-white/70 p-6 transition hover:-translate-y-1 hover:border-[#ccd8c9] hover:bg-white hover:shadow-[0_20px_50px_rgba(39,68,48,0.07)] sm:p-7"
          >
            <div className="flex items-start justify-between">
              <span
                className={`grid size-12 place-items-center rounded-2xl ${tint}`}
              >
                <Icon size={21} strokeWidth={1.7} aria-hidden="true" />
              </span>
              <span className="pt-1 text-xs font-semibold tracking-[0.14em] text-[#a4aca1]">
                {number}
              </span>
            </div>
            <h3 className="mt-8 text-xl font-semibold tracking-[-0.04em] text-[#254635]">
              {title}
            </h3>
            <p className="mt-3 max-w-sm text-sm leading-6 text-[#718075]">
              {description}
            </p>
            <div className="mt-7 h-px w-full bg-[#ebede5]" />
            <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#547054]">
              Explore learning
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
