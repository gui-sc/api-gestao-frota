import { z } from 'zod';
import { UserCreateSchema } from './UserSchema';
const DriverSchema = z.object({
    cnh: z.string(),
    aproved: z.boolean().optional().default(false),
})

export const createDriverSchema = UserCreateSchema.merge(DriverSchema);
