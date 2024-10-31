import { DataTypes } from "sequelize";
import sequelize from "../database";

export const VehiclePictureModel = sequelize.define('vehicle_picture', {
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
});