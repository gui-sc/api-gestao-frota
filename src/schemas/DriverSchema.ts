import { z } from 'zod';

export const DriverSchema = z.object({
    nome: z.string({ message: "Você precisa passar o nome" }),
    cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/),
    data_nasc: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/).refine((dateString) => {
        //Converte a string em um objeto Date
        const [day, month, year] = dateString.split("/");
        return new Date(`${year}-${month}-${day}`);
    }),
    cnh: z.string().length(11),
    logradouro: z.string(),
    bairro: z.string(),
    cidade: z.string(),
    telefone: z.string(),
})