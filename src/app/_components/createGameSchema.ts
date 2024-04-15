import { z } from "zod";

export const createGameSchema = z.object({
  numberOfPlayers: z.number({ coerce: true }).min(2).max(6).default(2),
  targetScore: z.number({ coerce: true }).min(1).default(50),
  isBotGame: z.string().default("true"),
});
