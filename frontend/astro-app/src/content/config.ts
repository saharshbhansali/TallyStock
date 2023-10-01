import type { ZodTypeAny } from 'astro/zod';
import { defineCollection, z } from 'astro:content';

const stock = defineCollection({
    type: 'data',
    schema: z.object({
        name: z.string(),
        price: z.number(),
        quantity: z.number(),
    }),
}) as ZodTypeAny;

const transaction = defineCollection({
    type: 'data',
    schema: z.object({
        hsn_referer: z.string(),
        price: z.number(),
        quantity: z.number(),
        date: z.date(),
        stock: stock
    }),
}) as ZodTypeAny;

export const collections = {
    'stocks': stock,
    'transactions': transaction,
};
