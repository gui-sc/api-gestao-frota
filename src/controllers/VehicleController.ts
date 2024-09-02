import { Request, Response } from "express";

export async function create(req: Request, res: Response) {
    res.status(200).json({ message: 'Create vehicle' });
}

export async function get(req: Request, res: Response) {
    res.status(200).json({ message: 'Get vehicle' });
}

export async function getById(req: Request, res: Response) {
    res.status(200).json({ message: 'Get vehicle by id' });
}

export async function update(req: Request, res: Response) {
    res.status(200).json({ message: 'Update vehicle' });
}

export async function remove(req: Request, res: Response) {
    res.status(200).json({ message: 'Remove vehicle' });
}