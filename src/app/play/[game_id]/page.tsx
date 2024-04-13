import PigGameUI from "@/components/PigGameUI";
import { TrackPageWithPlausible } from "@/components/track-page";
import { PARTYKIT_URL } from "@/lib/env";
import { notFound } from "next/navigation";

export default async function GamePage({
  params,
}: {
  params: { game_id: string };
}) {
  const gameId = params.game_id;

  const req = await fetch(`${PARTYKIT_URL}/parties/main/${gameId}`, {
    method: "GET",
    next: {
      revalidate: 0,
    },
  });

  if (!req.ok) {
    if (req.status === 404) {
      notFound();
    } else {
      throw new Error("Something went wrong.");
    }
  }

  // const gameState = (await req.json()) as GameState;

  return (
    <div>
      <TrackPageWithPlausible path="/play/_ID_" />
      <PigGameUI gameId={gameId} />
    </div>
  );
}
