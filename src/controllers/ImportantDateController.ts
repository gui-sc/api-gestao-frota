import { Request, Response } from "express";
import { Op } from "sequelize";
import { ImportantDateModel } from "../models/ImportantDate";
import { ImportantDateSchema } from "../schemas/ImportantDateSchema";
import { getByIdSchema } from "../schemas/CommonSchema";

export async function create(req: Request, res: Response) {
    try {
        const { body: { driver_id, date, description } } = ImportantDateSchema.parse(req);
        const [year, month, day] = date.split("-");
        const iDate = new Date(Number(year), Number(month) - 1, Number(day));

        const importantDate = await ImportantDateModel.create({ driver_id, date: iDate, description })

        return res.status(201).json({ message: "Data importante criada", importantDate })
    } catch (error) {
        res.status(500).json({ message: "Erro ao criar data importante" })
    }
}

export async function getAllDates(req: Request, res: Response) {
    try {
        const { params: { id } } = getByIdSchema.parse(req);

        const dates = await ImportantDateModel.findAll({
            where: {
                driver_id: Number(id)
            }
        });

        return res.status(200).json(dates);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Erro ao buscar datas importantes" });
    }
}

export async function getNextDates(req: Request, res: Response) {
    try {
        const { params: { id } } = getByIdSchema.parse(req);

        const today = new Date(
            Date.UTC(
                new Date().getFullYear(),
                new Date().getMonth(),
                new Date().getDate()
            )
        );

        const endDate = new Date(
            Date.UTC(
                new Date().getFullYear(),
                new Date().getMonth(),
                new Date().getDate()
            )
        );

        endDate.setDate(today.getDate() + 14); // Calcula a data de 14 dias a partir de hoje

        const dates = await ImportantDateModel.findAll({
            where: {
                driver_id: Number(id),
                date: {
                    [Op.between]: [today, endDate] // Filtra datas entre hoje e 14 dias a partir de hoje
                }
            }
        });

        return res.status(200).json(dates);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar datas importantes", error });
    }
}

export async function deleteDate(req: Request, res: Response) {
    try {
        const { params: { id } } = getByIdSchema.parse(req);

        await ImportantDateModel.destroy({ where: { id: Number(id) } });
        return res.status(204).send();
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Erro ao buscar datas importantes" });
    }
}