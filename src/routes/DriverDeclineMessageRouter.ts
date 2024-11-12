import { Router } from "express";
import * as Controller from '../controllers/DriverDeclineMessageController';

const router = Router();

router.post('/', Controller.create);
router.get('/', Controller.get);
router.get('/:id');
router.get('/driver/:id');
router.get('/admin/:id');

export default router;