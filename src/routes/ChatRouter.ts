import { Router } from "express";
import * as Controller from '../controllers/ChatController';

const router = Router();

router.post('/', Controller.create)
router.get('/driver/:userId', Controller.getChatsDriver)
router.get('/passenger/:userId', Controller.getChatsPassenger)
router.post('/message/:chatId', Controller.addMessage)
router.get('/message/:chatId', Controller.getMessagesFromChat)
router.get('/:id', Controller.getById)

export default router;

