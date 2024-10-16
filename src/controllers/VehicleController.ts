import { Request, Response } from "express";
import sequelize from "../database";
import { DataTypes } from "sequelize";

const Vehicle = sequelize.define('vehicle', {
    placa: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    modelo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ano: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cor: {
        type: DataTypes.STRING,
        allowNull: false
    },
    renavam: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});



export async function create(req: Request, res: Response) {
    try {
        const vehicle = req.body;
        await Vehicle.create(vehicle);
        res.status(200).json({ message: 'Veículo cadastrado com sucesso!' });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Erro ao criar veículo!' });
    }
    
}

export async function get(req: Request, res: Response) {
    try {
        const vehicles = await Vehicle.findAll();
        res.status(200).json(vehicles);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar veículos!' });
    }
  

}

export async function getById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const vehicle = await Vehicle.findByPk(id);
        res.status(200).json(vehicle);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar veículo!' });
    }
}

export async function update(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const vehicle = req.body;
        await Vehicle.update(vehicle, { where: { id } });
        res.status(200).json({ message: 'Veículo atualizado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar veículo!' });
    }
}

export async function remove(req: Request, res: Response) {
    try {
        const { id } = req.params;
        await Vehicle.destroy({ where: { id } });
        res.status(200).json({ message: 'Veículo removido com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao remover veículo!' });
    }
}