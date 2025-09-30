import * as z from 'zod';

export const SchemaTwitchPagination = z.object({
    cursor: z.string().optional(),
});
