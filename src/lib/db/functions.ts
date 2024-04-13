import { sum } from "drizzle-orm";
import { db } from ".";
import { rooms } from "./schema";
import { unstable_noStore } from "next/cache";

export async function getTotalGamesPlayed() {
  unstable_noStore();
  const gamesPlayed = await db
    .select({ totalGamesPlayed: sum(rooms.gamesPlayed).mapWith(Number) })
    .from(rooms);

  return gamesPlayed[0].totalGamesPlayed;
}
