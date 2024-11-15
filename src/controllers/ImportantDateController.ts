import { Request, Response } from "express";
import { Op } from "sequelize";
import { ImportantDateModel } from "../models/ImportantDate";

export async function create(req: Request, res: Response) {
    try {
        const { driver, date, description } = req.body

        const iDate = new Date(date);

        await ImportantDateModel.create({ driver_id: driver, date: iDate, description })

        return res.status(201).json({ message: "Data importante criada" })
    } catch (error) {
        console.error("Error:", error)
        res.status(500).json({ message: "Erro ao criar data importante" })
    }
}

export async function getAllDates(req: Request, res: Response) {
    try {
        const { id } = req.params;

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
        const { id } = req.params;

        const today = new Date();
        const endDate = new Date();
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
        console.error("Error:", error);
        res.status(500).json({ message: "Erro ao buscar datas importantes" });
    }
}

export async function deleteDate(req: Request, res: Response) {
    try {
        const { id } = req.params;

        await ImportantDateModel.destroy({ where: { id: Number(id) } }).then(res => {console.log("teste") })
        return res.status(204).send();
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Erro ao buscar datas importantes" });
    }
}