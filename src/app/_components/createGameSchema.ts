import { z } from "zod";

export const createGameSchema = z.object({
  numberOfPlayers: z.number({ coerce: true }).min(2).max(16),
  targetScore: z.number({ coerce: true }).min(1),
});
