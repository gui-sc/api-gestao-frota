import { Router } from "express";
import * as Controller from '../controllers/ImportantDateController';

const router = Router();

router.post('/', Controller.create)
router.get('/:id', Controller.getNextDates)
router.get('/allDates/:id', Controller.getAllDates)
router.delete('/:id', Controller.deleteDate)

export default router;

