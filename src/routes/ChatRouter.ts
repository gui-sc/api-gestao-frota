import { Router } from "express";
import * as Controller from '../controllers/ChatController';

const router = Router();

router.post('/', Controller.create)
router.get('/travel/:id', Controller.getByTravelId)
router.get('/driver/:id', Controller.getChatsDriver)
router.get('/passenger/:id', Controller.getChatsPassenger)
router.post('/message/:chatId', Controller.addMessage)
router.put('/message/:chatId/:userId', Controller.readAllMessages)
router.get('/message/:id', Controller.getMessagesFromChat)
router.get('/message/:chatId/:userId', Controller.getUnreadMessagesCount)
router.get('/:id', Controller.getById)

export default router;

