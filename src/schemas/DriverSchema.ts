import { z } from 'zod';

export const DriverSchema = z.object({
    name: z.string({message: "Você precisa passar o nome"}),
    cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/),
    active: z.boolean(),
    register: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).transform(value => new Date(value)),
    initialDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).transform(value => new Date(value)),
    finalDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).transform(value => new Date(value)),
})