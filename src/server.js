import 'dotenv/config.js'
import cors from 'cors';
import 'express-async-errors';
import express from 'express';

import { routes } from './routes/routes.js';
import { AppError } from './utils/AppError.js';
import { migrate } from './database/sqlite/migrations/migrate.js';
import { UPLOAD_FOLDER } from './configs/upload.js';

migrate();

const PORT = process.env.PORT || 3333;
const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(UPLOAD_FOLDER));
app.use(routes);
app.use(errorHandling);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

function errorHandling(error, req, res, next) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
}
