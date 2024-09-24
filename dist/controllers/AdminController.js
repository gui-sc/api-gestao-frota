"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = create;
exports.getByEmail = getByEmail;
exports.getById = getById;
exports.inativarPassageiro = inativarPassageiro;
exports.inativarMotorista = inativarMotorista;
const database_1 = __importDefault(require("../database"));
const sequelize_1 = require("sequelize");
const DriverController_1 = __importDefault(require("./DriverController"));
const PassageiroController_1 = __importDefault(require("./PassageiroController"));
const Admin = database_1.default.define('admin', {
    nome: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    senha: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
});
async function create(req, res) {
    try {
        const { nome, email, senha } = req.body;
        await Admin.create({ nome, email, senha });
        res.status(200).json({ message: 'Admin cadastrado com sucesso!' });
    }
    catch (error) {
        res.status(400).json({ message: 'Erro ao criar admin!' });
    }
}
async function getByEmail(req, res) {
    try {
        const { email } = req.params;
        const admin = await Admin.findOne({ where: { email } });
        res.status(200).json(admin);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao buscar admin!' });
    }
}
async function getById(req, res) {
    try {
        const { id } = req.params;
        const admin = await Admin.findByPk(id);
        res.status(200).json(admin);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao buscar admin!' });
    }
}
async function inativarPassageiro(req, res) {
    try {
        const { id } = req.params;
        await PassageiroController_1.default.update({ active: false }, { where: { id } });
        res.status(200).json({ message: 'Passageiro inativado com sucesso!' });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao inativar Passageiro!' });
    }
}
async function inativarMotorista(req, res) {
    try {
        const { id } = req.params;
        await DriverController_1.default.update({ active: false }, { where: { id } });
        res.status(200).json({ message: 'Motorista inativado com sucesso!' });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao inativar Motorista!' });
    }
}
exports.default = Admin;
//# sourceMappingURL=AdminController.js.map