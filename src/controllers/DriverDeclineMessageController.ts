import { Request, Response } from "express";
import { DriverDeclineMessageModel } from "../models/DriverDeclineMessage";
import sequelize from "../database";

export async function create(req: Request, res: Response) {

}

export async function get(req: Request, res: Response) {
    try {
        const messages = DriverDeclineMessageModel.findAll();
        return res.status(200).json(messages);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao criar mensagem!", error });
    }
}