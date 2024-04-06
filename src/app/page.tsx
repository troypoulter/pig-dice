import {
  PageHeader,
  PageHeaderHeading,
  PageHeaderDescription,
  PageActions,
} from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { PARTYKIT_URL } from "@/lib/env";
import { redirect } from "next/navigation";

const randomId = () => Math.random().toString(36).substring(2, 15);

export default function Home() {
  async function createGameRoom() {
    "use server";

    const id = randomId();

    await fetch(`${PARTYKIT_URL}/parties/main/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    redirect(`/play/${id}`);
  }

  return (
    <div>
      <PageHeader>
        <PageHeaderHeading>Pig: The Ultimate Dice Duel</PageHeaderHeading>
        <PageHeaderDescription>
          Risk it all or play it safe in a game of strategy and luck - where
          every roll can lead to victory or defeat!
        </PageHeaderDescription>
        <PageActions>
          <form action={createGameRoom}>
            <Button
              type="submit"
              className="bg-green-500 hover:bg-green-500/90"
            >
              <Play className="mr-1 h-4 w-4" /> Play Now
            </Button>
          </form>
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
