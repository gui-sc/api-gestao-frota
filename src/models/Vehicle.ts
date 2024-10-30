import sequelize from "../database";
import { DataTypes } from "sequelize";

export const VehicleModel = sequelize.define('vehicle', {
    plate: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    model: {
        type: DataTypes.STRING,
        allowNull: false
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    color: {
        type: DataTypes.STRING,
        allowNull: false
    },
    renavam: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    driver_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'drivers',
            key: 'id'
        }
    }
});