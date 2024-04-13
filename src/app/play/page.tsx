"use server";

import { CreateGameForm } from "../_components/CreateGameForm";
import { getTotalGamesPlayed } from "@/lib/db/functions";

export default async function Page() {
  const totalGamesPlayed = await getTotalGamesPlayed();

  return (
    <div className="mx-auto flex max-w-[980px] flex-col items-center">
      <CreateGameForm gamesPlayed={totalGamesPlayed} />
    </div>
  );
}
