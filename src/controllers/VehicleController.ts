import { Request, Response } from "express";
import { VehicleSchema, VehicleUpdateSchema } from "../schemas/VehicleSchema";
import { deleteFile, uploadFile } from "../helpers/GoogleCloudStorage";
import { VehiclePictureModel } from "../models/VehiclePicture";
import { VehicleModel } from "../models/Vehicle";
import { DriverDeclineMessageModel } from "../models/DriverDeclineMessage";
import { getByIdSchema } from "../schemas/CommonSchema";

export async function create(req: Request, res: Response) {
    try {
        const vehicle = VehicleSchema.parse(req.body);
        const pictures = req.files as Express.Multer.File[];
        const data = await VehicleModel.create({
            plate: vehicle.plate,
            brand: vehicle.model.split('-')[0],
            model: vehicle.model.split('-')[1],
            year: vehicle.year,
            color: vehicle.color,
            driver_id: vehicle.driver_id,
            renavam: vehicle.renavam
        }) as any;

        if (pictures) {
            pictures.forEach(async (picture: any, i: number) => {
                const filePath = `vehicle/${data.id}`;
                const fileName = `vehicle_${i}.${picture.originalname.split('.').pop()}`;
                await uploadFile(filePath, fileName, Buffer.from(picture.buffer));
                const url = `https://storage.googleapis.com/${process.env.BUCKET_NAME}/${filePath}/${fileName}`;
                await VehiclePictureModel.create({ url, vehicle_id: data.id });
            });
        }
        res.status(200).json({ message: 'Veículo cadastrado com sucesso!', data });
    } catch (error) {
        res.status(400).json({ message: 'Erro ao criar veículo!', error });
    }
}

export async function get(req: Request, res: Response) {
    try {
        const vehicles = await VehicleModel.findAll();
        res.status(200).json(vehicles);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar veículos!', error });
    }
}

export async function getById(req: Request, res: Response) {
    try {
        const { params: { id } } = getByIdSchema.parse(req);
        const vehicle = await VehicleModel.findByPk(id, {
            include: VehiclePictureModel
        });
        res.status(200).json(vehicle);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar veículo!', error });
    }
}

export async function update(req: Request, res: Response) {
    try {
        const { params, body } = VehicleUpdateSchema.parse(req);
        const { id } = params;
        const vehicle = body;
        const pictures = req.files as Express.Multer.File[];
        await VehicleModel.update({
            plate: vehicle.plate,
            brand: vehicle.model.split('-')[0],
            model: vehicle.model.split('-')[1],
            year: vehicle.year,
            color: vehicle.color,
            renavam: vehicle.renavam
        }, { where: { id } });

        const vehiclePictures = await VehiclePictureModel.findAll({ where: { vehicle_id: id } });
        vehiclePictures.forEach(async (picture: any) => {
            const originalPath = picture.url.split('/').slice(-3).join('/');
            console.log(originalPath);
            await deleteFile(originalPath);
            await VehiclePictureModel.destroy({ where: { id: picture.id } });
        });

        if (pictures) {
            pictures.forEach(async (picture: any, i: number) => {
                const filePath = `vehicle/${id}`;
                const fileName = `vehicle_${i}.${picture.originalname.split('.').pop()}`;
                await uploadFile(filePath, fileName, Buffer.from(picture.buffer));
                const url = `https://storage.googleapis.com/${process.env.BUCKET_NAME}/${filePath}/${fileName}`;
                await VehiclePictureModel.create({ url, vehicle_id: id });
            });
        }
        await DriverDeclineMessageModel.update({ read: true }, { where: { driver_id: vehicle.driver_id } });
        res.status(200).json({ message: 'Veículo atualizado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar veículo!', error });
    }
}

export async function remove(req: Request, res: Response) {
    try {
        const { params: { id } } = getByIdSchema.parse(req);
        await VehicleModel.destroy({ where: { id } });
        res.status(200).json({ message: 'Veículo removido com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao remover veículo!', error });
    }
}