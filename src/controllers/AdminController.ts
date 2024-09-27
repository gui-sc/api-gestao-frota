import { Request, Response } from "express";
import sequelize from "../database";
import { DataTypes } from "sequelize";
import Driver from "./DriverController";
import Passageiro from "./PassageiroController";

const Admin = sequelize.define('admin', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

export async function create(req: Request, res: Response) {
    try {
        const { nome, email, senha } = req.body;
        await Admin.create({ nome, email, senha });
        res.status(200).json({ message: 'Admin cadastrado com sucesso!' });
    } catch (error) {
        res.status(400).json({ message: 'Erro ao criar admin!' });
    }
}

export async function getByEmail(req: Request, res: Response) {
    try {
        const { email } = req.params;
        const admin = await Admin.findOne({ where: { email } });
        res.status(200).json(admin);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar admin!' });
    }
}

export async function getById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const admin = await Admin.findByPk(id);
        res.status(200).json(admin);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar admin!' });
    }
}

// export async function updatePassageiro(req: Request, res: Response) {
//     try {
//         const { id } = req.params;
//         const { nome, email, senha } = req.body;
//         await Passageiro.update({ nome, email, senha }, { where: { id } });
//         res.status(200).json({ message: 'Admin atualizado com sucesso!' });
//     } catch (error) {
//         res.status(500).json({ message: 'Erro ao atualizar admin!' });
//     }
// }

export async function inativarPassageiro(req: Request, res: Response) {
    try {
        const { id } = req.params;
        await Passageiro.update({ active: false }, { where: { id } });
        res.status(200).json({ message: 'Passageiro inativado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao inativar Passageiro!' });
    }
}

export async function inativarMotorista(req: Request, res: Response) {
    try {
        const { id } = req.params;
        await Driver.update({ active: false }, { where: { id } });
        res.status(200).json({ message: 'Motorista inativado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao inativar Motorista!' });
    }
}

//TODO: Implementar a função de remover passageiros

// export async function removePassageiro(req: Request, res: Response) {
//     try {
//         await Passageiro.destroy({ where: {} });
//         res.status(200).json({ message: 'Passageiro deletado com sucesso!' });
//     } catch (error) {
//         res.status(500).json({ message: 'Erro ao deletar passageiros!' });
//     }
// }



export default Admin;
