import { z } from 'zod';

export const VehicleSchema = z.object({
    model: z.string(),
    brand: z.string(),
    year: z.number(),
    chassis: z.string(),
    licenseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).transform(value => new Date(value)),
    licenseDueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).transform(value => new Date(value)),
    plate: z.string(),
    color: z.string(),
    active: z.boolean(),
    initialDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).transform(value => new Date(value)),
    finalDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).transform(value => new Date(value)),
    renavam: z.number(),
});