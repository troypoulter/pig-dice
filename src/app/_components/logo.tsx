import { PiggyBank } from "lucide-react";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link href="/">
      <div className="flex flex-row items-center gap-x-1 hover:opacity-75 transition-opacity">
        <PiggyBank size={28} color="#007DFC" />
        <div className="font-semibold text-lg text-[#007DFC]">Pig Dice</div>
      </div>
    </Link>
  );
};
