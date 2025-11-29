import * as z from 'zod';

export const SchemaChannel = z.object({
    broadcaster_language: z.string(),
    broadcaster_login: z.string(),
    display_name: z.string(),
    game_id: z.string(),
    game_name: z.string(),
    id: z.string(),
    is_live: z.boolean(),
    tags: z.array(z.string()),
    thumbnail_url: z.string(),
    title: z.string(),
    started_at: z.union([z.iso.datetime(), z.literal('')]).transform((val) => (val.length <= 0 ? null : new Date(val))),
});

export type TypeChannel = z.infer<typeof SchemaChannel>;
