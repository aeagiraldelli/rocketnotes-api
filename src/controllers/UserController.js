import { AppError } from '../utils/AppError.js';
import { databaseConnection } from '../database/sqlite/database.js';
import bcrypt from 'bcryptjs';

export class UserController {
  /** @type {import('express').RequestHandler} */
  async create(req, res) {
    const { name, email, password } = req.body;

    if (!name) {
      throw new AppError('Nome é obrigatório.');
    }

    if (!password) {
      throw new AppError('Senha é obrigatório.');
    }

    if (!email) {
      throw new AppError('Email é obrigatório.');
    }

    const db = await databaseConnection();
    const query = 'SELECT * FROM users WHERE email = (?)';
    const userExists = await db.get(query, [email]);

    if (userExists) {
      throw new AppError('Este email já está sendo utilizado!');
    }

    const cmd = `INSERT INTO users 
                 (name, email, password)
                 VALUES
                 (?, ?, ?)`;
    const hashedPassword = await bcrypt.hash(password, 8);

    try {
      await db.run(cmd, [name, email, hashedPassword]);
    } catch (error) {
      throw new AppError('Erro ao cadastrar novo usuário.', 500);
    }

    return res.status(201).json({});
  }

  /** @type {import('express').RequestHandler} */
  async update(req, res) {
    const { name, email, password, oldPassword } = req.body;
    const user_id = req.user.id;

    const db = await databaseConnection();
    const user = await db.get('SELECT * FROM users WHERE id = (?)', [user_id]);

    if (!user) {
      throw new AppError('Usuário não encontrado!');
    }

    const registeredUser = await db.get('SELECT * FROM users WHERE email = (?)', [email]);

    if (registeredUser && registeredUser.id !== user.id) {
      throw new AppError('Email já está em uso.');
    }

    user.email = email ?? user.email;
    user.name = name ?? user.name;

    if (password && !oldPassword) {
      throw new AppError('Você precisa informar a senha antiga para definir uma nova senha.');
    }

    if (password && oldPassword) {
      const passOk = await bcrypt.compare(oldPassword, user.password);
      if (!passOk) {
        throw new AppError('Senha antiga inválida.');
      }

      user.password = await bcrypt.hash(password, 8);
    }

    const cmd = `
        UPDATE users 
        SET
          name = ?,
          email = ?,
          password = ?,
          updated_at = DATETIME('now')
        WHERE id = ?`;
    await db.run(cmd, [user.name, user.email, user.password, user_id]);

    delete user.password;

    res.status(200).json({ user });
  }
}
