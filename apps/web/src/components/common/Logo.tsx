import Image from "next/image";
import Link from "next/link";

interface Props {
  isMobile?: boolean;
  className?: string;
}

const Logo = ({ isMobile, className }: Props) => {
  return (
    <Link href="/" aria-label="Trinity Health Solution home">
      <Image
        src="/images/logo-trinity-web.png"
        width={192}
        height={128}
        alt="Trinity Health Solution"
        className={`w-auto object-contain ${className ?? (isMobile ? "h-14" : "h-16")}`}
      />
    </Link>
  );
};

export default Logo;
