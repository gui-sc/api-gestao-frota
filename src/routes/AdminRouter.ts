import { Router } from "express";
import * as Controller from '../controllers/AdminController'; 

const router = Router();

router.post('/', Controller.create)
router.get('/:email', Controller.getByEmail)
router.get('/:id', Controller.getById)

export default router;

