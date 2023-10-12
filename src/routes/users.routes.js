import { Router } from 'express';
import multer from 'multer';

import { UserController } from '../controllers/UserController.js';
import { UserAvatarController } from '../controllers/UserAvatarController.js';
import { ensureAuthenticaded } from '../middlewares/ensureAuthenticaded.js';
import { MULTER } from '../configs/upload.js';

const userController = new UserController();
const avatarController = new UserAvatarController();
const upload = multer(MULTER);

export const userRoutes = Router();
userRoutes.post('/', userController.create);
userRoutes.put('/', ensureAuthenticaded, userController.update);
userRoutes.patch('/avatar', ensureAuthenticaded, upload.single('avatar'), avatarController.update);
