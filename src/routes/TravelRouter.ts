import { Router } from "express";
import * as Controller from '../controllers/TravelController';
const router = Router();

router.post('/', Controller.create)
router.put('/:id/location', Controller.updateLocation)
router.put('/:id/accept', Controller.acceptTravel)
router.put('/:id/init', Controller.initTravel)
router.put('/:id/finish', Controller.finishTravel)
router.get('/', Controller.getByRange)
router.get('/last/passenger/:id', Controller.getLastTravelsPassenger)
router.get('/last/driver/:id', Controller.getLastTravelsDriver)
router.get('/driver/:id', Controller.getDriver)
router.get('/:id', Controller.getById)
router.get('/:id/location', Controller.getActualLocation)
router.delete('/:id', Controller.remove)

export default router;