import { Router } from "express";
import * as Controller from '../controllers/TravelController';
const router = Router();

router.post('/', Controller.create)
router.get('/', Controller.getByRange)
router.post('/:id', Controller.acceptTravel)
router.delete('/:id', Controller.remove)

export default router;