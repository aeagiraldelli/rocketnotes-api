import { Router } from 'express';

import { TagsController } from '../controllers/TagsController.js';
import { ensureAuthenticaded } from '../middlewares/ensureAuthenticaded.js';

const tagsController = new TagsController();
export const tagsRoutes = Router();

tagsRoutes.use(ensureAuthenticaded);
tagsRoutes.get('/', tagsController.show);
