import { Request, Response } from "express";
import { DriverDeclineMessageModel } from "../models/DriverDeclineMessage";
import { DeclineMessageSchema } from "../schemas/DeclineMessageSchema";
import { getByIdSchema } from "../schemas/CommonSchema";

export async function create(req: Request, res: Response) {
    const { body: { driver_id, message } } = DeclineMessageSchema.parse(req);

    try {
        const driverDeclineMessage = await DriverDeclineMessageModel.create({
            driver_id: driver_id,
            message: message,
            read: undefined
        });
        return res.status(201).json(driverDeclineMessage);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao criar mensagem!", error });
    }
}

export async function get(req: Request, res: Response) {
    try {
        const messages = DriverDeclineMessageModel.findAll();
        return res.status(200).json(messages);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao criar mensagem!", error });
    }
}

export async function getNoReads(req: Request, res: Response) {
    try {
        const { params: { id } } = getByIdSchema.parse(req);
        const messages = await DriverDeclineMessageModel.findAll({
            where: {
                read: false,
                driver_id: id
            },
            order: [
                ['id', 'DESC']
            ]
        });
        return res.status(200).json(messages);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao buscar as mensagens!", error });
    }
}