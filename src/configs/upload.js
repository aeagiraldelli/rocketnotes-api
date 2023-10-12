import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import crypto from 'crypto';

const __dirname = fileURLToPath(import.meta.url);
export const TMP_FOLDER = path.resolve(__dirname, '..', '..', '..', 'tmp');
export const UPLOAD_FOLDER = path.resolve(__dirname, '..', '..', '..', 'uploads');

export const MULTER = {
  storage: multer.diskStorage({
    destination: TMP_FOLDER,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex');
      const filename = `${fileHash}-${file.originalname}`;
      return callback(null, filename);
    },
  }),
};
