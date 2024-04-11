import { z } from "zod";

export const createGameSchema = z.object({
  numberOfPlayers: z.number({ coerce: true }).min(2).max(6),
  targetScore: z.number({ coerce: true }).min(1),
});
