import { z } from "zod";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export const ImportantDateSchema = z.object({
    body: z.object({
        driver_id: z.number(),
        description: z.string(),
        date: z.string().refine((dataString) => {
            const isValid = dayjs(dataString, 'DD/MM/YYYY', true).isValid();
            return isValid;
        }, { message: 'Informe uma data válida no formato DD/MM/YYYY' })
            .transform((dataString) => {
                return dayjs(dataString, 'DD/MM/YYYY').format('YYYY-MM-DD');
            })
    })
})