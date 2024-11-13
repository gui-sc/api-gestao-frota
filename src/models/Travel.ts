import sequelize from "../database";
import { DataTypes } from "sequelize";

export const TravelModel = sequelize.define('travel', {
    destination: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    latitude_destination: {
        type: DataTypes.FLOAT, // Altere para FLOAT para precisão geográfica
        allowNull: false,
    },
    longitude_destination: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    latitude_origin: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    longitude_origin: {
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
    canceled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    initial_time: {
        type: DataTypes.DATE,
    },
    final_time: {
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