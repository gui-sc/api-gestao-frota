import multer from 'multer';
import multerConfig from '../config/MulterConfig';
import { Router } from "express";
import * as Controller from '../controllers/UserController';
const router = Router();

router.post('/', multer(multerConfig).single('avatar'), Controller.createUser)

export default router;