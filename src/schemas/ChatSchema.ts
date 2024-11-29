import { z } from 'zod';

export const CreateChatSchema = z.object({
    body: z.object({
        driver: z.number().or(z.string()).transform(Number),
        passenger: z.number().or(z.string()).transform(Number),
        travel_id: z.number().or(z.string()).transform(Number),
    })
});

export const AddMessageSchema = z.object({
    params: z.object({
        chatId: z.string().transform(Number)
    }),
    body: z.object({
        content: z.string(),
        sender: z.string(),
    })
});

export const GetMessagesCountSchema = z.object({
    params: z.object({
        chatId: z.string().transform(Number),
        userId: z.string().transform(Number)
    })
});