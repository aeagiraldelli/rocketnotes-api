import fs from 'fs';
import path from 'path';

import { TMP_FOLDER, UPLOAD_FOLDER } from '../configs/upload.js';

export class DiskStorage {
  async saveFile(file) {
    await fs.promises.rename(path.resolve(TMP_FOLDER, file), path.resolve(UPLOAD_FOLDER, file));
    return file;
  }

  async deleteFile(file) {
    const filePath = path.resolve(UPLOAD_FOLDER, file);

    try {
      await fs.promises.stat(filePath);
    } catch (error) {
      return;
    }

    await fs.promises.unlink(filePath);
  }
}
