import { Router } from 'express';

import { userRoutes } from './users.routes.js';
import { notesRoutes } from './notes.routes.js';
import { tagsRoutes } from './tags.routes.js';
import { sessionRoutes } from './session.routes.js';

export const routes = Router();

routes.use('/session', sessionRoutes);
routes.use('/users', userRoutes);
routes.use('/notes', notesRoutes);
routes.use('/tags', tagsRoutes);
