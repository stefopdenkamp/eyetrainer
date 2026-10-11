import { integer, sqliteTable } from 'drizzle-orm/sqlite-core';

// Single row (id = 1) holding all app settings.
export const settings = sqliteTable('settings', {
	id: integer('id').primaryKey(),
	moveSeconds: integer('move_seconds').notNull().default(30),
	ballSpeed: integer('ball_speed').notNull().default(400), // px per second
	flashSeconds: integer('flash_seconds').notNull().default(30),
	flashShowMs: integer('flash_show_ms').notNull().default(500),
	flashPauseMs: integer('flash_pause_ms').notNull().default(500),
	zoomRefreshSeconds: integer('zoom_refresh_seconds').notNull().default(10),
	zoomRows: integer('zoom_rows').notNull().default(14),
	zoomLetters: integer('zoom_letters').notNull().default(6),
	zoomMarkerRow: integer('zoom_marker_row').notNull().default(11) // 1-based, 0 = no marker
});

export type Settings = typeof settings.$inferSelect;
