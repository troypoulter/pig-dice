"use server";

import { TrackPageWithPlausible } from "@/components/track-page";
import { CreateGameForm } from "../_components/CreateGameForm";
import { getTotalGamesPlayed } from "@/lib/db/functions";
import { Instructions } from "@/components/instructions";
import { Separator } from "@/components/ui/separator";

export default async function Page() {
  const totalGamesPlayed = await getTotalGamesPlayed();

  return (
    <div className="mx-auto flex max-w-[980px] flex-col items-center">
      <TrackPageWithPlausible path="/play" />
      <CreateGameForm gamesPlayed={totalGamesPlayed} />
      <Separator className="mt-6 mb-4 max-w-[980px] mx-auto" />
      <Instructions />
    </div>
  );
}
