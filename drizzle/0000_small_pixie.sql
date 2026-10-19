CREATE TABLE `research_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `oauth_guides` (
	`id` text PRIMARY KEY NOT NULL,
	`content` text NOT NULL,
	`created_at` text NOT NULL
);
