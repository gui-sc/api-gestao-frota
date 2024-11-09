import { z } from 'zod';

export const UserCreateSchema = z.object({
    name: z.string(), 
    email: z.string(),
    password: z.string(),
    birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
        .transform(value => new Date(value).toISOString().split('T')[0]), 
    last_name: z.string(), 
    phone: z.string(), 
    cpf: z.string().length(11).regex(/^\d+$/), 
    type: z.enum(['passenger', 'driver', 'admin'])
})