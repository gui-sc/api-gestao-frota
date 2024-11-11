import { Request, Response } from "express";
import sequelize from "../database";
import { QueryTypes } from "sequelize";
import { TravelModel } from "../models/Travel";
import { ChatModel } from "../models/Chat";
import { UserModel } from "../models/User";

export async function getActiveTravelsPassenger(req: Request, res: Response) {
    try {
        const { id } = req.params;

        const travels = await TravelModel.findAll({
            where: {
                passenger: id,
                finished: false
            },
        })

        return res.status(200).json(travels)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao buscar viagens ativas" });
    }
}

export async function getActiveTravelsDriver(req: Request, res: Response) {
    try {
        const { id } = req.params;

        const travels = await TravelModel.findAll({
            where: {
                driver: id,
                finished: false
            },
        })

        return res.status(200).json(travels)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao buscar viagens ativas" });
    }
}

export async function getLastTravelsPassenger(req: Request, res: Response) {
    try {
        const { id } = req.params;

        const travels = await TravelModel.findAll({
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

        const travels = await TravelModel.findAll({
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

        const travel = await TravelModel.findByPk(id);

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
                    COS(RADIANS(:lat)) * COS(RADIANS(latitude_origin)) * 
                    COS(RADIANS(longitude_origin) - RADIANS(:lon)) + 
                    SIN(RADIANS(:lat)) * SIN(RADIANS(latitude_origin))
                )
            ) AS distance,
            (6371 *
                ACOS(
                    COS(RADIANS(latitude_origin)) * COS(RADIANS(latitude_destination)) *
                    COS(RADIANS(longitude_destination) - RADIANS(longitude_origin)) +
                    SIN(RADIANS(latitude_origin)) * SIN(RADIANS(latitude_destination))
                )
            ) AS total_distance
            FROM travels t
            INNER JOIN
                users u ON u.id = t.passenger
            WHERE (6371 * 
                ACOS(
                    COS(RADIANS(:lat)) * COS(RADIANS(latitude_origin)) * 
                    COS(RADIANS(longitude_origin) - RADIANS(:lon)) + 
                    SIN(RADIANS(:lat)) * SIN(RADIANS(latitude_origin))
                )) <= :radius AND t.finished = false AND t.driver IS NULL
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
        const travel = await TravelModel.create({
            ...req.body
        }) as any;
        res.status(200).json({ message: 'Viagem solicitada com sucesso!', id: travel.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao solicitar viagem!' });
    }
}

export async function remove(req: Request, res: Response) {
    try {
        const { id } = req.body;
        await TravelModel.destroy({ where: { id } })
        return res.status(204).send();
    } catch (err) {
        res.status(500).json({ "message": "Erro ao cancelar viagem" });
    }
}

export async function acceptTravel(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { driverId } = req.body;
        const travel = await TravelModel.findByPk(id) as any;
        await TravelModel.update({ driver: driverId }, { where: { id } })
        await ChatModel.create({
            driver: driverId,
            passenger: travel.passenger,
            travel_id: id
        })
        return res.status(204).send();
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ message: "Erro ao aceitar viagem" })
    }
}

export async function initTravel(req: Request, res: Response) {
    try {
        const { id } = req.params;

        await TravelModel.update({
            initiated: true,
            initial_time: new Date()
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

        await TravelModel.update({
            finished: true,
            final_time: new Date()
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

        const travel = await TravelModel.findByPk(id) as any;

        if (!travel) {
            return res.status(404).send({ message: "Viagem não encontrada." });
        }

        const driver = await UserModel.findByPk(travel.driver) as any;

        return res.status(200).json({ driver: {
            name: driver.name,
            avatarURL: driver.avatar
        } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao buscar motorista" });
    }
}

export async function updateLocation(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { latitude, longitude, type } = req.body;

        await TravelModel.update({
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

        const travel = await TravelModel.findByPk(id) as any;

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