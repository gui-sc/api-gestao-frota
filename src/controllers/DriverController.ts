import { Request, Response } from "express";
import { createDriverSchema } from "../schemas/DriverSchema";
import { DriverModel } from "../models/Driver";
import { UserModel } from "../models/User";
import { deleteFile, uploadFile } from "../helpers/GoogleCloudStorage";
import bcrypt from 'bcrypt';
import { VehicleModel } from "../models/Vehicle";
import { VehiclePictureModel } from "../models/VehiclePicture";
import { Op } from "sequelize";

const fileNames = ['profile_picture', 'cnh_picture', 'profile_doc_picture'];

export async function create(req: Request, res: Response) {
    try {
        //Usa o Zod para validar o corpo da requisição
        const driver = createDriverSchema.parse(req.body);
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        //Verifica se os arquivos foram enviados
        if (!files) {
            return res.status(400).json({ message: 'Arquivos não enviados!' });
        }
        //Verifica se os arquivos obrigatórios foram enviados
        if (!fileNames.every(name => {
            console.log(name, files[name]);
            return files[name]
        })) {
            return res.status(400).json({ message: 'Arquivos obrigatórios não enviados!' });
        }
        //cria primeiro um novo user
        const encriptedPassword = bcrypt.hashSync(driver.password, 10);
        const newUser = await UserModel.create({
            ...driver,
            active: false,
            password: encriptedPassword,
            cnh: undefined,
            approved: undefined,
        }) as any;
        if (!newUser) return res.status(500).json({ message: "Erro ao criar usuário" });
        //cria um novo driver com o id do user criado
        const newDriver = await DriverModel.create({
            cnh: driver.cnh,
            approved: driver.approved,
            profile_picture: '',
            cnh_picture: '',
            profile_doc_picture: '',
            user_id: newUser.id
        }) as any;
        if (!newDriver) return res.status(500).json({ message: "Erro ao criar usuário" });

        //Faz upload dos arquivos para o Google Cloud Storage
        Object.keys(files).forEach(async (key) => {
            const picture = files[key][0];
            const filePath = `driver/${newDriver.id}`;
            const fileName = `${key}.${picture.originalname.split('.').pop()}`;
            await uploadFile(`driver/${newDriver.id}`, `${key}.${picture.originalname.split('.').pop()}`, Buffer.from(picture.buffer));
            const url = `https://storage.googleapis.com/${process.env.BUCKET_NAME}/${filePath}/${fileName}`;
            if (key === 'profile_picture') await newUser.update({ avatar: url }, { where: { id: newUser.id } });
            await newDriver.update({ [key]: url }, { where: { id: newDriver.id } });
        })

        res.status(200).json({ message: 'Motorista cadastrado com sucesso!', id: newDriver.id });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Erro ao criar motorista!', error });
    }
}

export async function get(req: Request, res: Response) {
    try {
        const drivers = await DriverModel.findAll({
            include: {
                model: UserModel, //Faz join com users
                attributes: { exclude: ['password'] } //Exclui a senha do retorno
            }
        });
        res.status(200).json(drivers);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar motoristas!', error });
    }
}

export async function getPending(req: Request, res: Response) {
    try {
        const drivers = await DriverModel.findAll({
            where: { approved: false },
            include: [
                {
                    model: UserModel,
                    attributes: { exclude: ['password'] }
                }
            ]
        });
        res.status(200).json(drivers);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar motoristas pendentes!', error });
    }
}

export async function approvedriver(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const driver = await DriverModel.findByPk(id, {
            include: [
                {
                    model: UserModel,
                    attributes: { exclude: ['password'] }
                },
                {
                    model: VehicleModel
                }
            ]
        }) as any;
        if (!driver) return res.status(404).json({ message: 'Motorista não encontrado!' });

        await DriverModel.update({ approved: true }, { where: { id } });
        await UserModel.update({ active: true }, { where: { id: driver.user.id } });
        res.status(200).json({ message: 'Motorista aprovado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao aprovar motorista!', error });
    }
}

export async function getById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const driver = await DriverModel.findByPk(id, {
            include: [
                {
                    model: UserModel,
                    attributes: { exclude: ['password'] }
                },
                {
                    model: VehicleModel,
                    include: [
                        {
                            model: VehiclePictureModel
                        }
                    ]
                }
            ]
        });
        res.status(200).json(driver);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar motorista!', error });
    }
}

export async function getByName(req: Request, res: Response) {
    try {
        const { name } = req.params;
        const drivers = await DriverModel.findAll({
            include: {
                model: UserModel,
                attributes: { exclude: ['password'] },
                where: {
                    name: {
                        [Op.iLike]: `%${name}%` //Faz busca por nome
                    }
                }
            }
        });
        res.status(200).json(drivers);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar motorista!', error });
    }
}

export async function update(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const driver = await DriverModel.findByPk(id) as any;
        if (!driver) return res.status(404).json({ message: 'Motorista não encontrado!' });
        const user = await UserModel.findByPk(driver.user_id) as any;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        //Verifica se os arquivos foram enviados
        if (!files) {
            return res.status(400).json({ message: 'Arquivos não enviados!' });
        }
        //Verifica se os arquivos obrigatórios foram enviados
        if (!fileNames.every(name => {
            console.log(name, files[name]);
            return files[name]
        })) {
            return res.status(400).json({ message: 'Arquivos obrigatórios não enviados!' });
        }
        //todo atualizar motorista
        Object.keys(files).forEach(async (key) => {
            const originalPath = driver[key].split('/').slice(-3).join('/');
            console.log(originalPath);
            await deleteFile(originalPath);
            const picture = files[key][0];
            const filePath = `driver/${driver.id}`;
            const fileName = `${key}.${picture.originalname.split('.').pop()}`;
            await uploadFile(`driver/${driver.id}`, `${key}.${picture.originalname.split('.').pop()}`, Buffer.from(picture.buffer));
            const url = `https://storage.googleapis.com/${process.env.BUCKET_NAME}/${filePath}/${fileName}`;
            if (key === 'profile_picture') await user.update({ avatar: url }, { where: { id: user.id } });
            await driver.update({ [key]: url }, { where: { id: driver.id } });
        })
        res.status(200).json({ message: 'Motorista atualizado com sucesso!' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Erro ao atualizar motorista!', error });
    }
}

export const disableDriver = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const driver = DriverModel.findByPk(id) as any;
        if (!driver) return res.status(404).json({ message: 'Motorista não encontrado!' });
        const user = await UserModel.findByPk(driver.user_id) as any;
        await UserModel.update({ active: false }, { where: { id: user.id } });
        await DriverModel.update({ approved: false }, { where: { id: driver.id } });
        res.status(200).json({ message: 'Motorista desativado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao desativar motorista!', error });
    }
}

export async function remove(req: Request, res: Response) {
    try {
        const { id } = req.params;
        await DriverModel.destroy({ where: { id } });
        res.status(200).json({ message: 'Motorista removido com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao remover motorista!', error });
    }
}