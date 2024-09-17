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
const Driver = database_1.default.define('driver', {
    nome: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    idade: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    telefone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    cnh: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    rg: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
});
async function create(req, res) {
    try {
        const { nome, idade, telefone, cnh, rg } = req.body;
        await Driver.create({ nome, idade, telefone, cnh, rg });
        res.status(200).json({ message: 'Motorista cadastrado com sucesso!' });
    }
    catch (error) {
        res.status(400).json({ message: 'Erro ao criar motorista!' });
    }
}
async function get(req, res) {
    try {
        const drivers = await Driver.findAll();
        res.status(200).json(drivers);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao buscar motoristas!' });
    }
}
async function getById(req, res) {
    try {
        const { id } = req.params;
        const driver = await Driver.findByPk(id);
        res.status(200).json(driver);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao buscar motorista!' });
    }
}
async function update(req, res) {
    try {
        const { id } = req.params;
        const { nome, idade, telefone, cnh, rg } = req.body;
        await Driver.update({ nome, idade, telefone, cnh, rg }, { where: { id } });
        res.status(200).json({ message: 'Motorista atualizado com sucesso!' });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar motorista!' });
    }
}
async function remove(req, res) {
    try {
        const { id } = req.params;
        await Driver.destroy({ where: { id } });
        res.status(200).json({ message: 'Motorista removido com sucesso!' });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao remover motorista!' });
    }
}
//# sourceMappingURL=DriverController.js.map