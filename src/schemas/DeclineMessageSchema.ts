import { z } from "zod";

export const DeclineMessageSchema = z.object({
    body: z.object({
        message: z.string(),
        driver_id: z.string().transform((value) => parseInt(value)).refine((val) => !isNaN(val), {
            message: "DRIVER_ID deve ser um número válido!"
        }),
    })
});