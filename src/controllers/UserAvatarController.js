import { connection as knex } from '../database/knex/index.js';
import { AppError } from '../utils/AppError.js';
import { DiskStorage } from '../providers/DiskStorage.js';

export class UserAvatarController {
  /** @type {import('express').RequestHandler} */
  async update(request, response) {
    const user_id = request.user.id;
    const avatarFilename = request.file.filename;
    const user = await knex('users').where({ id: user_id }).first();

    if (!user) {
      throw new AppError('Para alterar o avatar o usuário precisa estar autenticado.', 401);
    }

    const ds = new DiskStorage();
    if (user.avatar) {
      await ds.deleteFile(user.avatar);
    }

    const filename = await ds.saveFile(avatarFilename);
    user.avatar = filename;

    await knex('users').update(user).where({ id: user_id });

    return response.status(200).json({ user });
  }
}
