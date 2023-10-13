import bcrypt from 'bcryptjs';
import { AppError } from '../utils/AppError.js';
import { UserRepository } from '../repositories/UserRepository.js';
import { UserCreateService } from '../services/UserCreateService.js';

export class UserController {
  /** @type {import('express').RequestHandler} */
  async create(req, res) {
    const { name, email, password } = req.body;

    

    const service = new UserCreateService(new UserRepository());
    await service.exec({ name, email, password });

    return res.status(201).json({});
  }

  /** @type {import('express').RequestHandler} */
  async update(req, res) {
    const { name, email, password, oldPassword } = req.body;
    const user_id = req.user.id;

    const userRepo = new UserRepository();
    const user = userRepo.findById(user_id);

    if (!user) {
      throw new AppError('Usuário não encontrado!');
    }

    const registeredUser = userRepo.findByEmail(email);

    if (registeredUser && registeredUser.id !== user.id) {
      throw new AppError('Email já está em uso.');
    }

    user.email = email ?? user.email;
    user.name = name ?? user.name;

    if (password && !oldPassword) {
      throw new AppError(
        'Você precisa informar a senha antiga para definir uma nova senha.'
      );
    }

    if (password && oldPassword) {
      const passOk = await bcrypt.compare(oldPassword, user.password);
      if (!passOk) {
        throw new AppError('Senha antiga inválida.');
      }

      user.password = await bcrypt.hash(password, 8);
    }

    await userRepo.update({
      id: user_id,
      name: user.name,
      email: user.email,
      password: user.password,
    });

    delete user.password;

    res.status(200).json({ user });
  }
}
