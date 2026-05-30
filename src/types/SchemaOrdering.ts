import * as z from 'zod';

export const SchemaOrdering = z.enum(['ASCENDANT', 'DESCENDANT']).default('DESCENDANT');

export type TypeOrdering = z.infer<typeof SchemaOrdering>;
