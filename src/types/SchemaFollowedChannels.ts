import {SchemaBroadcaster} from '@/types/SchemaBroadcaster.ts';
import {SchemaTwitchPagination} from '@/types/SchemaTwitchPagination.ts';
import * as z from 'zod';

export const SchemaFollowedChannels = z.object({
    pagination: SchemaTwitchPagination,
    data: z.array(SchemaBroadcaster),
});

export type TypeFollowedChannels = z.infer<typeof SchemaFollowedChannels>;
