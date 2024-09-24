"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
const sequelize_1 = require("sequelize");
const Passageiro = database_1.default.define('passageiro', {
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
exports.default = Passageiro;
//# sourceMappingURL=PassageiroController.js.map