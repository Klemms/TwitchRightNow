import {SchemaTwitchPagination} from '@/types/SchemaTwitchPagination.ts';
import * as z from 'zod';

export const SchemaSearchChannels = z.object({
    pagination: SchemaTwitchPagination,
    data: z.array(
        z.object({
            broadcaster_language: z.string(),
            broadcaster_login: z.string(),
            display_name: z.string(),
            game_id: z.string(),
            game_name: z.string(),
            id: z.string(),
            is_live: z.string(),
            tags: z.array(z.string()),
            thumbnail_url: z.string(),
            title: z.string(),
            started_at: z.string(),
        })
    ),
});

export type TypeSearchChannels = z.infer<typeof SchemaSearchChannels>;
