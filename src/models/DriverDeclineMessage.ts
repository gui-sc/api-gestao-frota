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

DriverDeclineMessageModel.belongsTo(UserModel, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

UserModel.hasMany(DriverDeclineMessageModel, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

DriverDeclineMessageModel.belongsTo(DriverModel, {
    foreignKey: 'driver_id',
    onDelete: 'CASCADE'
});

DriverModel.hasMany(DriverDeclineMessageModel, {
    foreignKey: 'driver_id',
    onDelete: 'CASCADE'
});