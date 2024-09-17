"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = create;
exports.get = get;
exports.getById = getById;
exports.update = update;
exports.remove = remove;
const database_1 = __importDefault(require("../database"));
const sequelize_1 = require("sequelize");
const Vehicle = database_1.default.define('vehicle', {
    placa: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    modelo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    ano: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    cor: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
});
async function create(req, res) {
    try {
        const { placa, modelo, ano, cor } = req.body;
        await Vehicle.create({ placa, modelo, ano, cor });
        res.status(200).json({ message: 'Veículo cadastrado com sucesso!' });
    }
    catch (error) {
        res.status(400).json({ message: 'Erro ao criar veículo!' });
    }
}
async function get(req, res) {
    try {
        const vehicles = await Vehicle.findAll();
        res.status(200).json(vehicles);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao buscar veículos!' });
    }
}
async function getById(req, res) {
    try {
        const { id } = req.params;
        const vehicle = await Vehicle.findByPk(id);
        res.status(200).json(vehicle);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao buscar veículo!' });
    }
}
async function update(req, res) {
    try {
        const { id } = req.params;
        const { placa, modelo, ano, cor } = req.body;
        await Vehicle.update({ placa, modelo, ano, cor }, { where: { id } });
        res.status(200).json({ message: 'Veículo atualizado com sucesso!' });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar veículo!' });
    }
}
async function remove(req, res) {
    try {
        const { id } = req.params;
        await Vehicle.destroy({ where: { id } });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao remover veículo!' });
    }
}
//# sourceMappingURL=VehicleController.js.map