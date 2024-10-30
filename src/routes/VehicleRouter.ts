import { Router } from "express";
import * as Controller from '../controllers/VehicleController';
import multer from 'multer';
import multerConfig from '../config/MulterConfig';
const router = Router();

router.post('/',multer(multerConfig).array('pictures'), Controller.create)
router.get('/', Controller.get)
router.get('/:id', Controller.getById)
router.put('/:id', Controller.update)
router.delete('/:id', Controller.remove)

export default router;