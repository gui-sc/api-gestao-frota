import { z } from 'zod';
import dayjs from 'dayjs';
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat); //Habilita um Plugin para melhorar a trataiva de formatos personalizados

export const DriverSchema = z.object({
    nome: z.string(),
    cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/).transform((cpf) => {
        //Remove os caracteres especiais do CPF
        return cpf.replace(/[^\d]/g, "");
    }),

    data_nasc: z.string()
        .refine((dataString) => {
            const isValid = dayjs(dataString, 'DD/MM/YYYY').isValid(); // Verifica se a data é válida
            const isBefore = dayjs(dataString, 'DD/MM/YYYY').isBefore(dayjs(), 'day'); // Verifica se está no futuro

            return isValid && isBefore;
        }, { message: 'Informe uma data de nascimento valida e no formato DD/MM/YYYY' })
        .refine((dataString) => {
            const userNascimento = dayjs(dataString, 'DD/MM/YYYY');
            const dataAtual = dayjs();
            const idade = dataAtual.diff(userNascimento, 'year');

            //Valida se tem 18 anos ou mais
            if (idade >= 18) {
                return true;
            }
            return false;
        }, { message: 'Voce precisa ter pelo menos 18 anos' })
        .transform((dataString) => {
            return dayjs(dataString, 'DD/MM/YYYY').toDate(); // Converte a data para um Date JavaScript
        }),

    cnh: z.string().length(11, { message: 'CNH deve ter 11 caracteres' }),
    logradouro: z.string(),
    bairro: z.string(),
    cidade: z.string(),
    telefone: z.string(),
})