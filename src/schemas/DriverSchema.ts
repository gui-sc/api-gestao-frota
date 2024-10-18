import { z } from 'zod';

export const DriverSchema = z.object({
    nome: z.string(),
    cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/).transform((cpf) => {
        //Remove os caracteres especiais do CPF
        return cpf.replace(/[^\d]/g, "");
    }),

    data_nasc: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, { message: 'Data invalida' }).transform((dateString) => {
        //Converte a string em um objeto Date
        const [day, month, year] = dateString.split("/");
        return new Date(`${year}-${month}-${day}`);
    }).refine((date) => {
        //Verifica se é um viajante do tempo
        if (date < new Date()) {
            return true;
        }
        return false;
    }, { message: 'Data de nascimento nao pode ser no futuro e nem atual' }),

    cnh: z.string().length(11, { message: 'CNH deve ter 11 caracteres' }),
    logradouro: z.string(),
    bairro: z.string(),
    cidade: z.string(),
    telefone: z.string(),
})