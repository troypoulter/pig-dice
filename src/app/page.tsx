import {
  PageHeader,
  PageHeaderHeading,
  PageHeaderDescription,
  PageActions,
} from "@/components/page-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Play } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div>
      <PageHeader>
        <PageHeaderHeading>Pig: The Ultimate Dice Duel</PageHeaderHeading>
        <PageHeaderDescription>
          Risk it all or play it safe in a game of strategy and luck - where
          every roll can lead to victory or defeat!
        </PageHeaderDescription>
        <PageActions>
          <Link
            href="/search"
            className={cn(
              buttonVariants(),
              "bg-green-500 hover:bg-green-500/90"
            )}
          >
            <Play className="mr-1 h-4 w-4" /> Play Now
          </Link>
        </PageActions>
      </PageHeader>
      <Separator />
      <div className="flex flex-col items-center mt-8">
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">
          How to play
        </h2>
      </div>
    </div>
  );
}
