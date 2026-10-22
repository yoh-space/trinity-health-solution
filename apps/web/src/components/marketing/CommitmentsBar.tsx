import { Check } from "lucide-react";
import { commitments } from "./marketingContent";

export function CommitmentsBar() {
  return (
    <section
      aria-label="Our commitments"
      className="border-y border-[#e8e8de] bg-[#f4f4ec]"
    >
      <div className="mx-auto grid max-w-7xl gap-5 px-5 py-6 sm:grid-cols-3 sm:px-8 sm:py-7 lg:px-12">
        {commitments.map((item) => (
          <div
            key={item}
            className="flex items-center justify-center gap-2.5 text-sm font-medium text-[#506255]"
          >
            <span className="grid size-5 place-items-center rounded-full bg-[#dce7d8] text-[#44634d]">
              <Check size={12} strokeWidth={2.5} aria-hidden="true" />
            </span>
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
