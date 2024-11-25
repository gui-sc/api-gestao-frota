import { Request, Response } from 'express';
import path from 'path';

export const sendIndexFile = (req: Request, res: Response): void => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
};
