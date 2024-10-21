import { Request, Response } from "express";
import sequelize from "../database";
import { DataTypes, QueryTypes } from "sequelize";

const Travel = sequelize.define('travel', {
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

export async function getLastTravelsPassenger(req: Request, res: Response) {
    try {
        const { id } = req.params;

        const travels = await Travel.findAll({
            where: {
                passenger: id,
                finished: true
            },
        })

        return res.status(200).json(travels)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao buscar ultimas viagens" });
    }
}

export async function getLastTravelsDriver(req: Request, res: Response) {
    try {
        const { id } = req.params;

        const travels = await Travel.findAll({
            where: {
                driver: id,
                finished: true
            },
        })

        return res.status(200).json(travels)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao buscar ultimas viagens" });
    }
}

export async function getById(req: Request, res: Response) {
    try {
        const { id } = req.params;

        const travel = await Travel.findByPk(id);

        if (!travel) {
            return res.status(404).send({ message: "Viagem não encontrada." });
        }

        return res.status(200).send(travel);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao buscar viagem" });
    }
}

export async function getByRange(req: Request, res: Response) {
    const { latitude, longitude, radius } = req.query;

    if (!latitude || !longitude || !radius) {
        return res.status(400).send({ message: "Latitude, longitude e radius são obrigatórios." });
    }

    const lat = parseFloat(latitude as string);
    const lon = parseFloat(longitude as string);
    const rad = parseFloat(radius as string);

    // Verifica se os parâmetros são válidos
    if (isNaN(lat) || isNaN(lon) || isNaN(rad)) {
        return res.status(400).send({ message: "Parâmetros inválidos." });
    }

    try {
        // SQL puro para calcular a distância
        const travels = await sequelize.query(
            `
            SELECT t.*,
            u.name as passenger_name,
            u.avatar, 
            (6371 * 
                ACOS(
                    COS(RADIANS(:lat)) * COS(RADIANS(latitudeOrigin)) * 
                    COS(RADIANS(longitudeOrigin) - RADIANS(:lon)) + 
                    SIN(RADIANS(:lat)) * SIN(RADIANS(latitudeOrigin))
                )
            ) AS distance,
            (6371 *
                ACOS(
                    COS(RADIANS(latitudeOrigin)) * COS(RADIANS(latitudedestination)) *
                    COS(RADIANS(longitudedestination) - RADIANS(longitudeOrigin)) +
                    SIN(RADIANS(latitudeOrigin)) * SIN(RADIANS(latitudedestination))
                )
            ) AS total_distance
            FROM travels t
            INNER JOIN
                users u ON u.id = t.passenger
            WHERE (6371 * 
                ACOS(
                    COS(RADIANS(:lat)) * COS(RADIANS(latitudeOrigin)) * 
                    COS(RADIANS(longitudeOrigin) - RADIANS(:lon)) + 
                    SIN(RADIANS(:lat)) * SIN(RADIANS(latitudeOrigin))
                )) <= :radius
            `,
            {
                replacements: { lat, lon, radius: rad },
                type: QueryTypes.SELECT
            }
        );

        return res.status(200).send(travels);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Erro ao buscar viagens" });
    }
}


export async function create(req: Request, res: Response) {
    try {
        await Travel.create({
            ...req.body
        });
        res.status(200).json({ message: 'Viagem solicitada com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao solicitar viagem!' });
    }
}

export async function remove(req: Request, res: Response) {
    try {
        const { id } = req.body;
        await Travel.destroy({ where: { id } })
        return res.status(204).send();
    } catch (err) {
        res.status(500).json({ "message": "Erro ao cancelar viagem" });
    }
}

export async function acceptTravel(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { driverId } = req.body;

        await Travel.update({ driver: driverId }, { where: { id } })
        return res.status(204).send();
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ message: "Erro ao aceitar viagem" })
    }
}

export async function initTravel(req: Request, res: Response) {
    try {
        const { id } = req.params;

        await Travel.update({
            initiated: true,
            initialTime: new Date()
        }, { where: { id } })

        return res.status(204).send();
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Erro ao iniciar viagem" });
    }
}

export async function finishTravel(req: Request, res: Response) {
    try {
        const { id } = req.params;

        await Travel.update({
            finished: true,
            finalTime: new Date()
        }, { where: { id } })

        return res.status(204).send();
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Erro ao iniciar viagem" });
    }
}

export async function getDriver(req: Request, res: Response) {
    try {
        const { id } = req.params;

        const travel = await Travel.findByPk(id) as any;

        if (!travel) {
            return res.status(404).send({ message: "Viagem não encontrada." });
        }

        return res.status(200).json({ driver: travel.driver });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao buscar motorista" });
    }
}

export async function updateLocation(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { latitude, longitude, type } = req.body;

        await Travel.update({
            ...(type === 'passenger' ? {
                actual_latitude_passenger: latitude,
                actual_longitude_passenger: longitude
            } : {
                actual_latitude_driver: latitude,
                actual_longitude_driver: longitude
            })
        }, { where: { id } })

        return res.status(204).send();
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Erro ao atualizar localização" });
    }
}

export async function getActualLocation(req: Request, res: Response) {
    try {
        const { id, type } = req.params;

        const travel = await Travel.findByPk(id) as any;

        if (!travel) {
            return res.status(404).send({ message: "Viagem não encontrada." });
        }

        return res.status(200).json(
            type === 'passenger' ? {
                latitude: travel.actual_latitude_driver,
                longitude: travel.actual_longitude_driver
            } : {
                latitude: travel.actual_latitude_passenger,
                longitude: travel.actual_longitude_passenger
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao buscar localização atual" });
    }
}