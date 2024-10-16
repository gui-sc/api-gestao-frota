import { DataTypes } from "sequelize";
import sequelize from "../database";
import { Request, Response } from "express";
import { uploadFile } from "../helpers/GoogleCloudStorage";
import bcrypt from 'bcrypt';
const User = sequelize.define('user', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telefone: {
        type: DataTypes.STRING,
    },
    cpf: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('passenger', 'driver', 'admin'),
        allowNull: false
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    avatar: {
        type: DataTypes.STRING,
    }
});

export async function createUser(req: Request, res: Response) {
    try {
        const { nome, email, senha, telefone, cpf, type } = req.body;
        const encriptedPassword = bcrypt.hashSync(senha, 10);
        const avatar = req.file;
        let url = '';
        const user = await User.create({
            nome,
            email,
            senha: encriptedPassword,
            telefone,
            cpf,
            type
        }) as any;
        if (!user) return res.status(500).json({ message: "Erro ao criar usuário" });

        if (avatar) {
            console.log(avatar);
            const filePath = `avatar/${user.id}`;
            const fileName = `avatar.${avatar.originalname.split('.').pop()}`;
            await uploadFile(`avatar/${user.id}`, `avatar.${avatar.originalname.split('.').pop()}`, Buffer.from(avatar.buffer)) as any
            const url = `https://storage.googleapis.com/${process.env.BUCKET_NAME}/${filePath}/${fileName}`;
            await user.update({ avatar: `${url}` }, { where: { id: user.id } });
        }

        res.status(201).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erro ao criar usuário" });
    }
}