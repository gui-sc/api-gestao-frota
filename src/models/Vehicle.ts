import sequelize from "../database";
import { DataTypes } from "sequelize";
import { VehiclePictureModel } from "./VehiclePicture";
import { DriverModel } from "./Driver";

export const VehicleModel = sequelize.define('vehicle', {
    plate: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    brand: {
        type: DataTypes.STRING,
        allowNull: false
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
});

VehicleModel.belongsTo(DriverModel, {
    foreignKey: 'driver_id',
});

DriverModel.hasOne(VehicleModel, {
    foreignKey: 'driver_id',
});

VehicleModel.hasMany(VehiclePictureModel, {
    foreignKey: 'vehicle_id',
});