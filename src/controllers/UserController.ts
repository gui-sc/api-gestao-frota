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
        delete user.senha;
        res.status(201).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erro ao criar usuário" });
    }
}

export async function getUsers(req: Request, res: Response) {
    try {
        const users = await User.findAll();
        res.status(200).json(users.map((user: any) => {
            delete user.senha;
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
        const user = await User.findByPk(id) as any;
        if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
        delete user.senha;
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erro ao buscar usuário" });
    }
}

export async function updateUser(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { nome, email, senha, telefone } = req.body;
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
        await User.update({ nome, email, senha, telefone }, { where: { id } });
        res.status(204).send();
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erro ao atualizar usuário" });
    }
}

export async function inactiveUser(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
        await User.update({ active: false }, { where: { id } });
        res.status(204).send();
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erro ao desativar usuário" });
    }
}

export async function activeUser(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
        await User.update({ active: true }, { where: { id } });
        res.status(204).send();
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erro ao ativar usuário" });
    }
}

export async function deleteUser(req: Request, res: Response) {
    try {
        const { id } = req.params;
        await User.destroy({ where: { id } });
        res.status(204).send();
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erro ao deletar usuário" });
    }
}

export async function loginApp(req: Request, res: Response) {
    try {
        const { email, senha } = req.body;
        const user = await User.findOne({ where: { email } }) as any;
        if (!user) return res.status(401).json({ message: "Credenciais incorretas" });
        if (!bcrypt.compareSync(senha, user.senha)) return res.status(401).json({ message: "Credenciais incorretas" });
        if(user.type === 'admin') return res.status(401).json({ message: "Credenciais incorretas" });
        delete user.senha;
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erro ao logar" });
    }
}

export async function loginAdmin(req: Request, res: Response) {
    try {
        const { email, senha } = req.body;
        const user = await User.findOne({ where: { email } }) as any;
        if (!user) return res.status(401).json({ message: "Credenciais incorretas" });
        if (!bcrypt.compareSync(senha, user.senha)) return res.status(401).json({ message: "Credenciais incorretas" });
        if(user.type !== 'admin') return res.status(401).json({ message: "Credenciais incorretas" });
        delete user.senha;
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erro ao logar" });
    }
}