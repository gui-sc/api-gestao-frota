import { z } from 'zod';

export const AdminSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    active: z.boolean(),
    register: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).transform(value => new Date(value)),
    initialDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).transform(value => new Date(value)),
    finalDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).transform(value => new Date(value)),
})