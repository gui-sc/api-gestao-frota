import { Router } from "express";
import * as Controller from '../controllers/TravelController';
const router = Router();

router.post('/', Controller.create)
router.post('/:id', Controller.acceptTravel)
router.put('/:id/init', Controller.initTravel)
router.put('/:id/finish', Controller.finishTravel)
router.get('/', Controller.getByRange)
router.get('/last/passenger/:id', Controller.getLastTravelsPassenger)
router.get('/last/driver/:id', Controller.getLastTravelsDriver)
router.delete('/:id', Controller.remove)

export default router;