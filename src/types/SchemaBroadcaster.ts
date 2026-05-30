import * as z from 'zod';

export const SchemaBroadcaster = z.object({
    broadcaster_id: z.string(),
    broadcaster_login: z.string(),
    broadcaster_name: z.string(),
    followed_at: z.iso.datetime().transform((val) => new Date(val)),
});

export type TypeBroadcaster = z.infer<typeof SchemaBroadcaster>;
