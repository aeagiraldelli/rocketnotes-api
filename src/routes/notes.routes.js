import { Router } from 'express';

import { NotesController } from '../controllers/NotesController.js';
import { ensureAuthenticaded } from '../middlewares/ensureAuthenticaded.js';

export const notesRoutes = Router();

const notesController = new NotesController();

notesRoutes.use(ensureAuthenticaded);
notesRoutes.post('/', notesController.create);
notesRoutes.get('/:id', notesController.show);
notesRoutes.delete('/:id', notesController.delete);
notesRoutes.get('/', notesController.list);
