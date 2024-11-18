import { DataTypes } from "sequelize";
import sequelize from "../database";
import { VehicleModel } from "./Vehicle";

export const VehiclePictureModel = sequelize.define('vehicle_picture', {
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

VehicleModel.hasMany(VehiclePictureModel, {
    foreignKey: 'vehicle_id',
    onDelete: 'CASCADE'
});

VehiclePictureModel.belongsTo(VehicleModel, {
    foreignKey: 'vehicle_id',
    onDelete: 'CASCADE'
});
