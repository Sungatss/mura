import Image from "next/image";

/** The supplied emblem accompanies a crisp, accessible Kazakh wordmark. */
export function BrandMark() {
  return <span className="brand-mark" aria-hidden="true">
    <Image src="/brand/mura-logo.webp" alt="" width={100} height={100} unoptimized />
  </span>;
}
