import { Router } from "express";
import * as Controller from '../controllers/DriverController'; 
const router = Router();

router.post('/', Controller.create)
router.get('/', Controller.get)
router.get('/:id', Controller.getById)
router.put('/:id', Controller.update)
router.delete('/:id', Controller.remove)

export default router;