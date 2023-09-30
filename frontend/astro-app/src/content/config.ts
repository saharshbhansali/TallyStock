import { defineCollection, z } from 'astro:content';

const stock = defineCollection({
    type: 'data',
    schema: z.object({
        name: z.string(),
        price: z.number(),
        quantity: z.number(),
    }),
});

const transaction = defineCollection({
    type: 'data',
    schema: z.object({
        hsn_referer: z.string(),
        price: z.number(),
        quantity: z.number(),
        date: z.date(),
    }),
    stock: stock,
});

export const collections = {
    'stocks': stock,
    'transactions': transaction,
};
