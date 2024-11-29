import { z } from 'zod';

export const UserCreateSchema = z.object({
    name: z.string().transform(value => value.trim()),
    email: z.string().transform(value => value.trim().toLowerCase()),
    password: z.string(),
    birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
        .transform(value => new Date(value).toISOString().split('T')[0]),
    last_name: z.string().transform(value => value.trim()),
    phone: z.string().transform(value => value.trim()),
    cpf: z.string().length(11).regex(/^\d+$/),
    type: z.enum(['passenger', 'driver', 'admin'])
})

export const UserUpdateSchema = z.object({
    params: z.object({
        id: z.string().transform(Number)
    }),
    body: z.object({
        name: z.string().transform(value => value.trim()),
        email: z.string().transform(value => value.trim().toLowerCase()),
        password: z.string(),
        birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
            .transform(value => new Date(value).toISOString().split('T')[0]),
        last_name: z.string().transform(value => value.trim()),
        phone: z.string().transform(value => value.trim()),
    })
})

export const LoginSchema = z.object({
    body: z.object({
        login: z.string().transform(value => value.trim().toLowerCase()),
        password: z.string()
    })
})