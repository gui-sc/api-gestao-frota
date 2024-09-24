import { Request, Response } from "express";
import sequelize from "../database";
import { DataTypes } from "sequelize";

const Driver = sequelize.define('driver', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    idade: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    telefone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cnh: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rg: {
        type: DataTypes.STRING,
        allowNull: false
    }

});

export async function create(req: Request, res: Response) {
    try {
        const { nome, idade, telefone, cnh, rg } = req.body;
        await Driver.create({ nome, idade, telefone, cnh, rg });
        res.status(200).json({ message: 'Motorista cadastrado com sucesso!' });
    } catch (error) {
        res.status(400).json({ message: 'Erro ao criar motorista!' });
    }
   
}

export async function get(req: Request, res: Response) {
    try {
        const drivers = await Driver.findAll();
        res.status(200).json(drivers);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar motoristas!' });
    
}
    
    }

export async function getById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const driver = await Driver.findByPk(id);
        res.status(200).json(driver);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar motorista!' });
    }
}

export async function update(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { nome, idade, telefone, cnh, rg } = req.body;
        await Driver.update({ nome, idade, telefone, cnh, rg }, { where: { id } });
        res.status(200).json({ message: 'Motorista atualizado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar motorista!' });
    }
}

export async function remove(req: Request, res: Response) {
    try {
        const { id } = req.params;
        await Driver.destroy({ where: { id } });
        res.status(200).json({ message: 'Motorista removido com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao remover motorista!' });
    }
}

export default Driver;