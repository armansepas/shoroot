import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <div className="flex items-center gap-6">
      <Link
        href="/"
        className="text-xl flex font-bold text-foreground md:pl-20 gap-4 items-center justify-center hover:opacity-80 transition-opacity"
      >
        <Image
          src="/logo.jpg"
          alt="Logo"
          width={50}
          height={50}
          className="rounded-full"
        />
        <span className="font-semibold text-primary">ShorOOt</span>
      </Link>
    </div>
  );
}
