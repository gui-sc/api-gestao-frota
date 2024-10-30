import sequelize from "../database";
import { DataTypes } from "sequelize";

export const ChatModel = sequelize.define('chat', {
    driver: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    passenger: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
});