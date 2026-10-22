import Image from "next/image";
import Link from "next/link";

export function Wordmark() {
  return (
    <Link
      href="/"
      aria-label="Trinity Health Solution home"
      className="inline-flex shrink-0 items-center"
    >
      <Image
        src="/images/logo-trinity-web.png"
        width={192}
        height={128}
        alt="Trinity Health Solution"
        className="h-[68px] w-auto object-contain"
        priority
      />
    </Link>
  );
}
