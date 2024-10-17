import { Request, Response } from "express";
import sequelize from "../database";
import { DataTypes } from "sequelize";
import { DriverSchema } from "../schemas/DriverSchema";

const Driver = sequelize.define('driver', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    data_nasc: {
        type: DataTypes.DATE,
        allowNull: false
    },
    telefone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cnh: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    cpf: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    logradouro: {
        type: DataTypes.STRING,
        allowNull: false
    },
    bairro: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cidade: {
        type: DataTypes.STRING,
        allowNull: false
    },

});

export async function create(req: Request, res: Response) {
    try {
        //Usa o Zod para validar o corpo da requisição
        const driver = DriverSchema.parse(req.body);
        const data = await Driver.create(driver);
        res.status(200).json({ message: 'Motorista cadastrado com sucesso!', data });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Erro ao criar motorista!', error });
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
        let driver = req.body;
        driver.data_nasc = new Date(driver.data_nasc);
        await Driver.update(driver, { where: { id } });
        res.status(200).json({ message: 'Motorista atualizado com sucesso!' });
    } catch (error) {
        console.log(error);
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
