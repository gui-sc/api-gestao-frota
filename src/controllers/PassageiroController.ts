import { Request, Response } from "express";
import sequelize from "../database";
import { DataTypes } from "sequelize";
import Driver from "./DriverController";

const Passageiro = sequelize.define('passageiro', {
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

export default Passageiro;