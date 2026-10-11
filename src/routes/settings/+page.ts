import type { Settings } from '#lib/server/db/schema.ts';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const res = await fetch('/api/settings');
	return { settings: (await res.json()) as Settings };
};
