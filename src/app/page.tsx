"use server";

import {
  PageHeader,
  PageHeaderHeading,
  PageHeaderDescription,
  PageActions,
} from "@/components/page-header";
import { CreateGameForm } from "./_components/CreateGameForm";
import { getTotalGamesPlayed } from "@/lib/db/functions";
import { TrackPageWithPlausible } from "@/components/track-page";
import { Instructions } from "@/components/instructions";
import { Separator } from "@/components/ui/separator";

export default async function Home() {
  const totalGamesPlayed = await getTotalGamesPlayed();

  return (
    <div>
      <TrackPageWithPlausible path="/" />
      <PageHeader>
        <PageHeaderHeading>Pig: The Ultimate Dice Duel</PageHeaderHeading>
        <PageHeaderDescription>
          Risk it all or play it safe in a game of strategy and luck - where
          every roll can lead to victory or defeat!
        </PageHeaderDescription>
        <PageActions>
          <CreateGameForm gamesPlayed={totalGamesPlayed} />
        </PageActions>
      </PageHeader>
      <Separator className="-mt-4 mb-4 max-w-[980px] mx-auto" />
      <Instructions />
    </div>
  );
}
