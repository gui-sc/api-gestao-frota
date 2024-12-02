import { Request, Response } from "express";
import sequelize from "../database";
import { QueryTypes } from "sequelize";
import { TravelModel } from "../models/Travel";
import { ChatModel } from "../models/Chat";
import { UserModel } from "../models/User";
import { acceptTravelSchema, getByIdAndTypeSchema, createTravelSchema, getByRangeSchema, removeTravelSchema, updateLocationSchema } from "../schemas/TravelSchema";
import { getByIdSchema } from "../schemas/CommonSchema";

export async function getActiveTravels(id: number, type: 'driver' | 'passenger') {
    try {
        const travel = await TravelModel.findOne({
            where: {
                [type]: id,
                finished: false
            },
        }) as any;
        if (!travel) return undefined;

        const passenger = await UserModel.findByPk(travel.passenger) as any;

        let driver: any = null;
        if (travel.driver) {
            driver = await UserModel.findByPk(travel.driver) as any;
        }

        return {
            tripId: travel.id,
            pickupCoordinates: {
                latitude: travel.latitude_origin,
                longitude: travel.longitude_origin
            },
            dropoffCoordinates: {
                latitude: travel.latitude_destination,
                longitude: travel.longitude_destination
            },
            passenger: {
                name: passenger.name,
                avatar: passenger.avatar
            },
            ...(driver ? {
                driver: {
                    name: driver.name,
                    avatar: driver.avatar
                },
                driverLocation: {
                    latitude: travel.actual_latitude_driver,
                    longitude: travel.actual_longitude_driver
                }
            } : {})
        }
    } catch (error) {
        console.error(error);
        throw new Error("Erro ao buscar viagens ativas");
    }
}

export async function getLastTravelsPassenger(req: Request, res: Response) {
    try {
        const { params: { id } } = getByIdSchema.parse(req);
        //buscar viagens que foram encerradas ou canceladas
        const travels = await TravelModel.findAll({
            where: {
                passenger: id,
                finished: true,
                canceled: false
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
        const { params: { id } } = getByIdSchema.parse(req);

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
        const { params: { id } } = getByIdSchema.parse(req);

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
    const { query: { latitude, longitude, radius } } = getByRangeSchema.parse(req);

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
                )) <= :radius AND t.finished = false 
                AND t.driver IS NULL AND t.canceled = false
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
        const { body } = createTravelSchema.parse(req);
        const travel = await TravelModel.create({
            ...body
        }) as any;
        res.status(200).json({ message: 'Viagem solicitada com sucesso!', id: travel.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao solicitar viagem!' });
    }
}

export async function remove(req: Request, res: Response) {
    try {
        const { body: { id } } = removeTravelSchema.parse(req);
        await TravelModel.destroy({ where: { id } })
        return res.status(204).send();
    } catch (err) {
        res.status(500).json({ "message": "Erro ao cancelar viagem" });
    }
}

export async function acceptTravel(req: Request, res: Response) {
    try {
        const { params: { id }, body: { driverId, longitude, latitude } } = acceptTravelSchema.parse(req);

        const travel = await TravelModel.findByPk(id) as any;
        await TravelModel.update({
            driver: driverId,
            actual_latitude_driver: latitude,
            actual_longitude_driver: longitude
        }, { where: { id } })
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
        const { params: { id } } = getByIdSchema.parse(req);

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
        const { params: { id } } = getByIdSchema.parse(req);

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

export async function cancelTravel(req: Request, res: Response) {
    try {
        const { params: { id, type } } = getByIdAndTypeSchema.parse(req);

        if (type === 'driver') {
            await TravelModel.update({
                driver: null,
                actual_latitude_driver: null,
                actual_longitude_driver: null
            }, { where: { id } })
        } else {
            await TravelModel.update({
                canceled: true,
                finished: true
            }, { where: { id } })
        }

        return res.status(204).send();
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Erro ao cancelar viagem" });
    }
}

export async function getDriver(req: Request, res: Response) {
    try {
        const { params: { id } } = getByIdSchema.parse(req);

        const travel = await TravelModel.findByPk(id) as any;

        if (!travel) {
            return res.status(404).send({ message: "Viagem não encontrada." });
        }

        if (!travel.driver) {
            return res.status(200).json({ driver: null });
        }

        const driver = await UserModel.findByPk(travel.driver) as any;

        return res.status(200).json({
            driver: {
                name: driver.name,
                avatarURL: driver.avatar
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao buscar motorista" });
    }
}

export async function updateLocation(req: Request, res: Response) {
    try {
        const { params, body } = updateLocationSchema.parse(req);
        const { id } = params;
        const { latitude, longitude, type } = body;

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
        const { params: { id, type } } = getByIdAndTypeSchema.parse(req);

        const travel = await TravelModel.findByPk(id) as any;

        if (!travel) {
            return res.status(404).send({ message: "Viagem não encontrada." });
        }

        return res.status(200).json({
            canceled: travel.canceled,
            ...(type === 'passenger' ? {
                latitude: travel.actual_latitude_driver,
                longitude: travel.actual_longitude_driver
            } : {
                latitude: travel.actual_latitude_passenger,
                longitude: travel.actual_longitude_passenger
            })
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao buscar localização atual" });
    }
}