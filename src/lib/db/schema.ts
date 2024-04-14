import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const rooms = sqliteTable("rooms", {
  id: integer("id").primaryKey(),
  roomId: text("name").notNull(),
  maxPlayers: integer("max_players").notNull(),
  targetScore: integer("target_score").notNull(),
  botEnabled: integer("bot_enabled", { mode: "boolean" }).default(false),
  gamesPlayed: integer("games_played").default(0),
  botWins: integer("bot_wins").default(0),
  playerWins: integer("player_wins").default(0),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull()
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});
