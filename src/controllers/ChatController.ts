import { Request, Response } from "express";
import { DataTypes, QueryTypes } from "sequelize";
import sequelize from "../database";

const Chat = sequelize.define('chat', {
    driver: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    passenger: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
});

const Message = sequelize.define('message', {
    chat_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sender: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
})

export async function create(req: Request, res: Response) {
    try {
        const { driver, passenger } = req.body;
        await Chat.create({ driver, passenger });
        res.status(200).json({ message: 'Conversa cadastrado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar conversa!' });
    }
}

export async function addMessage(req: Request, res: Response) {
    try {
        const { chatId } = req.params;

        const { content, sender } = req.body;
        if (!chatId || !content || !sender) {
            return res.status(400).json({ message: "Você precisa enviar 'ChatId', 'content' e 'sender'" })
        }
        await Message.create({ chat_id: Number(chatId), content, sender });
        res.status(200).json({ message: "Mensagem enviada!" })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao enviar mensagem!' });
    }
}

export async function getById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const chat = await Chat.findByPk(id);
        return res.status(200).json(chat);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao buscar conversa" });
    }
}

export async function getChatsPassenger(req: Request, res: Response) {
    try {
        const { userId } = req.params;

        const chats = await getChats('Passenger', Number(userId));
        return res.status(200).json(chats);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erro ao buscar conversas" });
    }
}

export async function getChatsDriver(req: Request, res: Response) {
    try {
        const { userId } = req.params;

        const chats = await getChats('Driver', Number(userId));

        return res.status(200).json(chats);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erro ao buscar conversas" });
    }
}

export async function getMessagesFromChat(req: Request, res: Response) {
    try {
        const { chatId } = req.params;
        const messages = (await Message.findAll({ where: { chat_id: chatId } })).sort((a: any, b: any) => {
            return a.createdAt - b.createdAt
        })
        return res.status(200).json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao buscar mensagens da conversa" });
    }
}

async function getChats(type: 'Driver' | 'Passenger', id: number) {
    try {

        const chats = await sequelize.query(`
            SELECT 
                c.id AS chat_id,
                c.driver,
                c.passenger,
                MAX(m."createdAt") AS last_message_time,
                COUNT(CASE WHEN m.read = false AND m.sender != :userId 
                 THEN 1 END) AS unread_count
            FROM 
                chats c
            LEFT JOIN 
                messages m ON m.chat_id = c.id
            WHERE 
            ${type == 'Driver' ? ' c.driver = :userId ' : ' c.passenger = :userId '}
            GROUP BY 
                c.id, c.driver, c.passenger
            HAVING 
                MAX(m."createdAt") IS NOT NULL
            ORDER BY 
                last_message_time DESC
        `, {
            replacements: { userId: id },
            type: QueryTypes.SELECT
        });
        console.log(chats)
        return chats;
    } catch (err) {
        console.log("Erro ao buscar chats generico:", err);
        throw err;
    }
}