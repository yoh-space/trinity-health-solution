import Image from "next/image";
import Link from "next/link";

interface Props {
  isMobile?: boolean;
  className?: string;
  href?: string;
}

const Logo = ({ isMobile, className, href = "/" }: Props) => {
  return (
    <Link href={href} aria-label="Trinity Health Solution home" className="inline-flex items-center">
      <Image
        src="/images/logo-trinity-web.png"
        width={192}
        height={128}
        priority
        alt="Trinity Health Solution Logo"
        className={`w-auto object-contain ${className ?? (isMobile ? "h-11 sm:h-12" : "h-14 sm:h-16")}`}
      />
    </Link>
  );
};

export default Logo;
