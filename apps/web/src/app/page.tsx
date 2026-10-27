import { LandingStoryPanel } from "@/components/landing/LandingStoryPanel";
import { PhoneMockup } from "@/components/landing/PhoneMockup";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#e6f1e8] text-[#14221a] flex flex-col justify-center items-center py-6 sm:py-10 px-4 sm:px-6 lg:px-8 relative overflow-x-hidden selection:bg-[#cbe7d1] selection:text-[#0b4d24]">
      {/* Background dot pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-80 z-0"
        style={{
          backgroundImage:
            "radial-gradient(#bbd3bf 0.75px, transparent 0.75px)",
          backgroundSize: "22px 22px",
        }}
        aria-hidden="true"
      />

      {/* Main Container matching Figma Studio Layout */}
      <div className="relative z-10 w-full max-w-[1060px] mx-auto flex flex-col lg:flex-row items-center lg:items-center justify-center gap-10 lg:gap-14 xl:gap-20">
        <LandingStoryPanel />
        <PhoneMockup />
      </div>
    </main>
  );
}
