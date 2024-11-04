import { Request, Response } from "express";
import { DriverSchema } from "../schemas/DriverSchema";
import { DriverModel } from "../models/Driver";
import { UserModel } from "../models/User";

export async function create(req: Request, res: Response) {
    try {
        //Usa o Zod para validar o corpo da requisição
        //const driver = DriverSchema.parse(req.body);
        const driver = req.body;
        const data = await DriverModel.create(driver);
        res.status(200).json({ message: 'Motorista cadastrado com sucesso!', data });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Erro ao criar motorista!', error });
    }
}

export async function get(req: Request, res: Response) {
    try {
        const drivers = await DriverModel.findAll({
            include: {
                model: UserModel,
            }
        });
        res.status(200).json(drivers);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar motoristas!', error });
    }
}

export async function getById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const driver = await DriverModel.findByPk(id, {
            include: {
                model: UserModel
            }
        });
        res.status(200).json(driver);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar motorista!', error });
    }
}

export async function update(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const driver = DriverSchema.parse(req.body);
        await DriverModel.update(driver, { where: { id } });
        res.status(200).json({ message: 'Motorista atualizado com sucesso!', driver });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Erro ao atualizar motorista!', error });
    }
}

export async function remove(req: Request, res: Response) {
    try {
        const { id } = req.params;
        await DriverModel.destroy({ where: { id } });
        res.status(200).json({ message: 'Motorista removido com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao remover motorista!', error });
    }
}