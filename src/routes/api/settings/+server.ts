import { error, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '#lib/server/db/index.ts';
import { settings } from '#lib/server/db/schema.ts';
import type { RequestHandler } from './$types';

const KEYS = [
	'moveSeconds',
	'ballSpeed',
	'flashSeconds',
	'flashShowMs',
	'flashPauseMs',
	'zoomRefreshSeconds',
	'zoomRows',
	'zoomLetters',
	'zoomMarkerRow'
] as const;

async function getSettings() {
	const [row] = await db.insert(settings).values({ id: 1 }).onConflictDoNothing().returning();
	return row ?? (await db.select().from(settings).where(eq(settings.id, 1)))[0];
}

export const GET: RequestHandler = async () => json(await getSettings());

export const PATCH: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const update: Partial<Record<(typeof KEYS)[number], number>> = {};

	for (const key of KEYS) {
		if (!(key in body)) continue;
		const value = body[key];
		const min = key === 'zoomMarkerRow' ? 0 : 1;
		if (!Number.isInteger(value) || value < min) error(400, `${key} must be an integer >= ${min}`);
		if (key === 'zoomLetters' && value > 12) error(400, 'zoomLetters must be at most 12');
		update[key] = value;
	}

	await getSettings();
	const [row] = await db.update(settings).set(update).where(eq(settings.id, 1)).returning();
	return json(row);
};
