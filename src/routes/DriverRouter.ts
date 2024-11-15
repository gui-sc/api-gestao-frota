import { Router } from "express";
import * as Controller from '../controllers/DriverController';
import multer from 'multer';
import multerConfig from '../config/MulterConfig';
const router = Router();

router.post('/', multer(multerConfig).fields(
    [
        { name: 'profile_picture', maxCount: 1 },
        { name: 'cnh_picture', maxCount: 1 },
        { name: 'profile_doc_picture', maxCount: 1 }
    ]
), Controller.create);
router.get('/', Controller.get);
router.get('/pending', Controller.getPending);
router.get('/:id', Controller.getById);
router.put('/:id/approved', Controller.aproveDriver);
router.put('/:id', multer(multerConfig).fields(
    [
        { name: 'profile_picture', maxCount: 1 },
        { name: 'cnh_picture', maxCount: 1 },
        { name: 'profile_doc_picture', maxCount: 1 }
    ]
), Controller.update);
router.delete('/:id', Controller.remove);

export default router;