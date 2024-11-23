import sequelize from "../database";
import { DataTypes } from "sequelize";
import { UserModel } from "./User";
import { DriverModel } from "./Driver";

export const DriverDeclineMessageModel = sequelize.define('driver_decline_message', {
    message: {
        type: DataTypes.STRING,
        allowNull: false
    },
    read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

DriverDeclineMessageModel.belongsTo(DriverModel, {
    foreignKey: 'driver_id',
    onDelete: 'CASCADE'
});

DriverModel.hasMany(DriverDeclineMessageModel, {
    foreignKey: 'driver_id',
    onDelete: 'CASCADE'
});