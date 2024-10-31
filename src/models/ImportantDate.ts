import { DataTypes } from "sequelize";
import sequelize from "../database";

export const ImportantDateModel = sequelize.define('important_date', {
    driver_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    }
});