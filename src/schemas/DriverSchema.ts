import { z } from 'zod';
import dayjs from 'dayjs';
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat); //Habilita um Plugin para melhorar a trataiva de formatos personalizados

export const DriverSchema = z.object({
    nome: z.string().transform((nome) => {
        nome = nome.toLowerCase(); // Converte o nome para minúsculo
        return nome.trim(); // Remove espaços em branco no início e no final
    }),
    cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/).transform((cpf) => {
        //Remove os caracteres especiais do CPF
        return cpf.replace(/[^\d]/g, "");
    }),

    data_nasc: z.string()
        .refine((dataString) => {
            const isValid = dayjs(dataString, 'DD/MM/YYYY', true).isValid(); // Verifica se a data é válida
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
    logradouro: z.string().transform((logradouro) => {
        logradouro = logradouro.toLowerCase(); // Converte o logradouro para minúsculo
        return logradouro.trim(); // Remove espaços em branco no início e no final
    }),

    bairro: z.string().transform((bairro) => {
        bairro = bairro.toLowerCase(); // Converte o bairro para minúsculo
        return bairro.trim(); // Remove espaços em branco no início e no final
    }),

    cidade: z.string().transform((cidade) => {
        cidade = cidade.toLowerCase(); // Converte a cidade para minúsculo
        return cidade.trim(); // Remove espaços em branco no início e no final
    }),

    telefone: z.string(),
})
