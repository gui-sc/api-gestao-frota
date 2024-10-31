import { Request, Response } from "express";
import { VehicleSchema } from "../schemas/VehicleSchema";
import { uploadFile } from "../helpers/GoogleCloudStorage";
import { VehiclePictureModel } from "../models/VehiclePicture";
import { VehicleModel } from "../models/Vehicle";

export async function create(req: Request, res: Response) {
    try {
        const vehicle = VehicleSchema.parse(req.body);
        const pictures = req.files as Express.Multer.File[];
        const data = await VehicleModel.create(vehicle) as any;
        
        if(pictures){
            pictures.forEach(async (picture: any) => {
                const filePath = `vehicle/${data.id}`;
                const fileName = `vehicle.${picture.originalname.split('.').pop()}`;
                await uploadFile(`vehicle/${data.id}`, `vehicle.${picture.originalname.split('.').pop()}`, Buffer.from(picture.buffer));
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
        const { id } = req.params;
        const vehicle = await VehicleModel.findByPk(id);
        res.status(200).json(vehicle);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar veículo!', error });
    }
}

export async function update(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const vehicle = VehicleSchema.parse(req.body);
        await VehicleModel.update(vehicle, { where: { id } });
        res.status(200).json({ message: 'Veículo atualizado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar veículo!', error });
    }
}

export async function remove(req: Request, res: Response) {
    try {
        const { id } = req.params;
        await VehicleModel.destroy({ where: { id } });
        res.status(200).json({ message: 'Veículo removido com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao remover veículo!', error });
    }
}