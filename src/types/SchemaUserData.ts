import * as z from 'zod';

export const SchemaUserData = z.object({
    avatarURL: z.string().nullable().default(null),
    creationDate: z.number().nullable().default(null),
    login: z.string().nullable().default(null),
    username: z.string().nullable().default(null),
});

export type TypeUserData = z.infer<typeof SchemaUserData>;
