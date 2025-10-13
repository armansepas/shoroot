import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="text-xl flex font-bold text-gray-900 dark:text-white md:pl-20 gap-4 items-center justify-center"
    >
      <Image src="/logo.jpg" alt="Logo" width={50} height={50} />
      ShorOOt
    </Link>
  );
}
