import { Router } from 'express';
import { SessionController } from '../controllers/SessionController.js';

export const sessionRoutes = Router();
const sessionController = new SessionController();

sessionRoutes.post('/', sessionController.create);
