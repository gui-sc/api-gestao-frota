import { Request, Response } from "express";

export async function create(req: Request, res: Response) {
    res.status(200).json({ message: 'Create driver' });
}

export async function get(req: Request, res: Response) {
    res.status(200).json({ message: 'Get driver' });
}

export async function getById(req: Request, res: Response) {
    res.status(200).json({ message: 'Get driver by id' });
}

export async function update(req: Request, res: Response) {
    res.status(200).json({ message: 'Update driver' });
}

export async function remove(req: Request, res: Response) {
    res.status(200).json({ message: 'Remove driver' });
}