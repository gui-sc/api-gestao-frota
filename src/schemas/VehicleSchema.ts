import { z } from 'zod';

export const VehicleSchema = z.object({
    model: z.string().transform((modelo) => modelo.toLowerCase()),
    year: z.number().or(z.string()).transform(ano => Number(ano)).refine((ano) => {
        if (ano >= 1900) {
            return true;
        }
        return false;
    }, { message: 'ANO deve ser a partir de 1900' }),
    plate: z.string().length(7).transform((placa) => placa.toUpperCase()).refine((placa) => {
        if (/[A-Z]{3}\d{4}/.test(placa) || /[A-Z]{3}\d{1}[A-Z]{1}\d{2}/.test(placa)) {
            return true;
        }
        return false;
    }, { message: 'A placa deve estar no formato XXX9999 ou XXX9X99' }),

    color: z.string().transform((cor) => cor.trim().toLowerCase()),
    renavam: z.string().length(11, { message: 'RENAVAM deve ter 11 caracteres' }),
    driver_id: z.number().or(z.string()).transform((id) => Number(id))
});