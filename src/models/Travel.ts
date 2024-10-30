import sequelize from "../database";
import { DataTypes } from "sequelize";

export const TravelModel = sequelize.define('travel', {
    destination: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    latitudedestination: {
        type: DataTypes.FLOAT, // Altere para FLOAT para precisão geográfica
        allowNull: false,
    },
    longitudedestination: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    latitudeorigin: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    longitudeorigin: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    passenger: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    driver: {
        type: DataTypes.INTEGER
    },
    value: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    initiated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    finished: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    initialTime: {
        type: DataTypes.DATE,
    },
    finalTime: {
        type: DataTypes.DATE,
    },
    actual_latitude_driver: {
        type: DataTypes.FLOAT,
    },
    actual_longitude_driver: {
        type: DataTypes.FLOAT,
    },
    actual_latitude_passenger: {
        type: DataTypes.FLOAT,
    },
    actual_longitude_passenger: {
        type: DataTypes.FLOAT,
    }
});