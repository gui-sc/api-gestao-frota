import sequelize from "../database";
import { DataTypes } from "sequelize";
import { UserModel } from "./User";

export const DriverModel = sequelize.define('driver', {
    cnh: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    profile_picture: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cnh_picture: {
        type: DataTypes.STRING,
        allowNull: false
    },
    profile_doc_picture: {
        type: DataTypes.STRING,
        allowNull: false
    },

});

DriverModel.belongsTo(UserModel, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});