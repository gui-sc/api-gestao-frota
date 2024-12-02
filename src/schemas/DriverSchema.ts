import { z } from 'zod';
import { UserCreateSchema } from './UserSchema';
const DriverSchema = z.object({
    cnh: z.string(),
    approved: z.boolean().optional().default(false),
})

export const createDriverSchema = UserCreateSchema.merge(DriverSchema);

export const getDriverByNameSchema = z.object({
    params: z.object({
        name: z.string(),
    })
})