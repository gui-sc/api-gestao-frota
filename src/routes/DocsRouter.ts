import { Router } from "express";
import * as Controller from '../controllers/DocsController';

const router = Router();

router.get('/', Controller.sendIndexFile);

export default router;

