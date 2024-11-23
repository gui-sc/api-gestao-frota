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
router.get('/search/:name', Controller.getByName);
router.get('/:id', Controller.getById);
router.put('/:id/approve', Controller.approvedriver);
router.put('/:id', multer(multerConfig).fields(
    [
        { name: 'profile_picture', maxCount: 1 },
        { name: 'cnh_picture', maxCount: 1 },
        { name: 'profile_doc_picture', maxCount: 1 }
    ]
), Controller.update);
router.put('/disable/:id', Controller.disableDriver);

export default router;