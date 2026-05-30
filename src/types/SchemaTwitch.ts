import {SchemaUserData} from '@/types/SchemaUserData.ts';
import * as z from 'zod';

export const SchemaTwitch = z.object({
    clientId: z.string().nullable().default(null),
    expirationDate: z.number().nullable().default(null),
    login: z.string().nullable().default(null),
    scopes: z.array(z.string()).default([]),
    token: z.string().nullable().default(null),
    userData: SchemaUserData.default({
        avatarURL: null,
        creationDate: null,
        login: null,
        username: null,
    }),
    userId: z.string().nullable().default(null),
});

export type TypeTwitch = z.infer<typeof SchemaTwitch>;
