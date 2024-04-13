"use server";

import { TrackPageWithPlausible } from "@/components/track-page";
import { CreateGameForm } from "../_components/CreateGameForm";
import { getTotalGamesPlayed } from "@/lib/db/functions";

export default async function Page() {
  const totalGamesPlayed = await getTotalGamesPlayed();

  return (
    <div className="mx-auto flex max-w-[980px] flex-col items-center">
      <TrackPageWithPlausible path="/play" />
      <CreateGameForm gamesPlayed={totalGamesPlayed} />
    </div>
  );
}
