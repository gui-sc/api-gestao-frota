import { z } from 'zod';

export const VehicleSchema = z.object({
    modelo: z.string(),
    ano: z.number(),
    placa: z.string().length(7).transform((placa) => placa.toUpperCase()).refine((placa) => {
        // Placa no formato AAA9999 ou AAA9A99
        if (/[A-Z]{3}\d{4}/.test(placa) || /[A-Z]{3}\d{1}[A-Z]{1}\d{2}/.test(placa)) {
            return true;
        }
        return false;
    }),

    cor: z.string(),
    renavam: z.string(),
});