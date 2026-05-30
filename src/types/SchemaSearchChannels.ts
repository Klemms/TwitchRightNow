import {SchemaChannel} from '@/types/SchemaChannel.ts';
import {SchemaTwitchPagination} from '@/types/SchemaTwitchPagination.ts';
import * as z from 'zod';

export const SchemaSearchChannels = z.object({
    pagination: SchemaTwitchPagination,
    data: z.array(SchemaChannel),
});

export type TypeSearchChannels = z.infer<typeof SchemaSearchChannels>;
