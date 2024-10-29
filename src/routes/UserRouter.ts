import multer from 'multer';
import multerConfig from '../config/MulterConfig';
import { Router } from "express";
import * as Controller from '../controllers/UserController';
const router = Router();

router.post('/', multer(multerConfig).single('avatar'), Controller.createUser)
router.post('/login/app', Controller.loginApp)
router.post('/login/web', Controller.loginAdmin)
router.get('/', Controller.getUsers)
router.get('/:id', Controller.getUser)
router.put('/inactive/:id', Controller.inactiveUser)
router.put('/active/:id', Controller.activeUser)
router.put('/:id', Controller.updateUser)
router.delete('/:id', Controller.deleteUser)

export default router;