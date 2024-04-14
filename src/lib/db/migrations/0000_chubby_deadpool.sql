CREATE TABLE `rooms` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`max_players` integer NOT NULL,
	`target_score` integer NOT NULL,
	`bot_enabled` integer DEFAULT false,
	`games_played` integer DEFAULT 0,
	`bot_wins` integer DEFAULT 0,
	`player_wins` integer DEFAULT 0,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
