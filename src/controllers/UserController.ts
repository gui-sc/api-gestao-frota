import { Request, Response } from "express";
import { uploadFile } from "../helpers/GoogleCloudStorage";
import { UserModel } from "../models/User";
import bcrypt from 'bcrypt';

export async function createUser(req: Request, res: Response) {
    try {
        const { name, email, password, birth_date, last_name, phone, cpf, type } = req.body;
        const encriptedPassword = bcrypt.hashSync(password, 10);
        const avatar = req.file;
        let url = '';
        const user = await UserModel.create({
            name,
            email,
            birth_date,
            password: encriptedPassword,
            phone,
            last_name,
            cpf,
            type
        }) as any;
        if (!user) return res.status(500).json({ message: "Erro ao criar usuário" });

        if (avatar) {
            console.log(avatar);
            const filePath = `avatar/${user.id}`;
            const fileName = `avatar.${avatar.originalname.split('.').pop()}`;
            await uploadFile(`avatar/${user.id}`, `avatar.${avatar.originalname.split('.').pop()}`, Buffer.from(avatar.buffer));
            const url = `https://storage.googleapis.com/${process.env.BUCKET_NAME}/${filePath}/${fileName}`;
            await user.update({ avatar: `${url}` }, { where: { id: user.id } });
        }
        delete user.password;
        res.status(201).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erro ao criar usuário" });
    }
}

export async function getUsers(req: Request, res: Response) {
    try {
        const users = await UserModel.findAll({
            attributes: { exclude: ['password'] }
        });
        res.status(200).json(users.map((user: any) => {
            return user;
        }));
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erro ao buscar usuários" });
    }
}

export async function getUser(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const user = await UserModel.findByPk(id, {
            attributes: { exclude: ['password'] }
        });
        if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erro ao buscar usuário" });
    }
}

export async function updateUser(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { name, email, password, phone, last_name } = req.body;
        const user = await UserModel.findByPk(id);
        if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
        await UserModel.update({ name, email, password, phone, last_name }, { where: { id } });
        res.status(204).send();
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erro ao atualizar usuário" });
    }
}

export async function inactiveUser(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const user = await UserModel.findByPk(id);
        if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
        await UserModel.update({ active: false }, { where: { id } });
        res.status(204).send();
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erro ao desativar usuário" });
    }
}

export async function activeUser(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const user = await UserModel.findByPk(id);
        if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
        await UserModel.update({ active: true }, { where: { id } });
        res.status(204).send();
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erro ao ativar usuário" });
    }
}

export async function deleteUser(req: Request, res: Response) {
    try {
        const { id } = req.params;
        await UserModel.destroy({ where: { id } });
        res.status(204).send();
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erro ao deletar usuário" });
    }
}

export async function loginApp(req: Request, res: Response) {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ where: { email } }) as any;
        if (!user) return res.status(401).json({ message: "Credenciais incorretas" });
        if (!bcrypt.compareSync(password, user.password)) return res.status(401).json({ message: "Credenciais incorretas" });
        if (user.type === 'admin') return res.status(401).json({ message: "Credenciais incorretas" });
        delete user.password;
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erro ao logar" });
    }
}

export async function loginAdmin(req: Request, res: Response) {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ where: { email } }) as any;
        if (!user) return res.status(401).json({ message: "Credenciais incorretas" });
        if (!bcrypt.compareSync(password, user.password)) return res.status(401).json({ message: "Credenciais incorretas" });
        if (user.type !== 'admin') return res.status(401).json({ message: "Credenciais incorretas" });
        delete user.password;
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erro ao logar" });
    }
}