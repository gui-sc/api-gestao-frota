import { Request, Response } from "express";
import { QueryTypes } from "sequelize";
import sequelize from "../database";
import { ChatModel } from "../models/Chat";
import { MessageModel } from "../models/Message";
import { AddMessageSchema, CreateChatSchema, GetMessagesCountSchema } from "../schemas/ChatSchema";
import { getByIdSchema } from "../schemas/CommonSchema";

export async function create(req: Request, res: Response) {
    try {
        const { body: { driver, passenger, travel_id } } = CreateChatSchema.parse(req);
        await ChatModel.create({ driver, passenger, travel_id });
        res.status(200).json({ message: 'Conversa cadastrado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar conversa!' });
    }
}

export async function addMessage(req: Request, res: Response) {
    try {
        const { params, body } = AddMessageSchema.parse(req);
        const { chatId } = params;

        const { content, sender } = body;
        await MessageModel.create({ chat_id: Number(chatId), content, sender });
        res.status(200).json({ message: "Mensagem enviada!" })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao enviar mensagem!' });
    }
}

export async function getById(req: Request, res: Response) {
    try {
        const { params: { id } } = getByIdSchema.parse(req);

        const chat = await ChatModel.findByPk(id);
        return res.status(200).json(chat);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao buscar conversa" });
    }
}

export async function getByTravelId(req: Request, res: Response) {
    try {
        const { params: { id } } = getByIdSchema.parse(req);
        const chat = await ChatModel.findOne({ where: { travel_id: id } });
        return res.status(200).json(chat);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao buscar conversa" });
    }
}

export async function getChatsPassenger(req: Request, res: Response) {
    try {
        const { params: { id } } = getByIdSchema.parse(req);

        const chats = await getChats('Passenger', Number(id));
        return res.status(200).json(chats);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erro ao buscar conversas" });
    }
}

export async function getChatsDriver(req: Request, res: Response) {
    try {
        const { params: { id } } = getByIdSchema.parse(req);

        const chats = await getChats('Driver', Number(id));

        return res.status(200).json(chats);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erro ao buscar conversas" });
    }
}

export async function getMessagesFromChat(req: Request, res: Response) {
    try {
        const { params: { id } } = getByIdSchema.parse(req);
        const messages = (await MessageModel.findAll({ where: { chat_id: id } })).sort((a: any, b: any) => {
            return a.createdAt - b.createdAt
        })
        return res.status(200).json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao buscar mensagens da conversa" });
    }
}

export async function getUnreadMessagesCount(req: Request, res: Response) {
    try {
        const { params: { chatId, userId } } = GetMessagesCountSchema.parse(req);

        const chat = await ChatModel.findByPk(chatId) as any;
        if (!chat) return res.status(404).json({ message: "Conversa não encontrada" });
        if (chat.driver != userId && chat.passenger != userId) return res.status(403).json({ message: "Você não tem permissão para acessar essa conversa" });
        const key = chat.driver == userId ? 'passenger' : 'driver';
        const unreadMessagesCount = await MessageModel.count({ where: { chat_id: chatId, read: false, sender: chat[key] } });
        return res.status(200).json({ unreadMessagesCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao buscar mensagens não lidas" });
    }
}

export async function readAllMessages(req: Request, res: Response) {
    try {
        const { params: { chatId, userId } } = GetMessagesCountSchema.parse(req);
        const chat = await ChatModel.findByPk(chatId) as any;
        if (!chat) return res.status(404).json({ message: "Conversa não encontrada" });
        if (chat.driver != userId && chat.passenger != userId) return res.status(403).json({ message: "Você não tem permissão para acessar essa conversa" });
        const key = chat.driver == userId ? 'passenger' : 'driver';
        await MessageModel.update({ read: true }, { where: { chat_id: chatId, sender: chat[key] } });
        return res.status(200).json({ message: "Mensagens marcadas como lidas" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao marcar mensagens como lidas" });
    }
}

async function getChats(type: 'Driver' | 'Passenger', id: number) {
    try {

        const chats = await sequelize.query(`
            SELECT 
                c.id AS chat_id,
                c.driver,
                c.passenger,
                u.name AS ${type == 'Driver' ? 'passenger' : 'driver'}_name,
                u.avatar,
                MAX(m."createdAt") AS last_message_time,
                (SELECT m2.content 
                FROM messages m2 
                WHERE m2.chat_id = c.id 
                ORDER BY m2."createdAt" DESC 
                LIMIT 1) AS last_message_content,
                COUNT(CASE WHEN m.read = false AND m.sender != :userId 
                    THEN 1 END) AS unread_count
            FROM 
                chats c
            INNER JOIN
                users u ON u.id = c.${type == 'Driver' ? 'passenger' : 'driver'}
            LEFT JOIN 
                messages m ON m.chat_id = c.id
            WHERE 
                ${type == 'Driver' ? ' c.driver = :userId ' : ' c.passenger = :userId '}
            GROUP BY 
                c.id, c.driver, c.passenger, u.name, u.avatar
            HAVING 
                MAX(m."createdAt") IS NOT NULL
            ORDER BY 
                last_message_time DESC;
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