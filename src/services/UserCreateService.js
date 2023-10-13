import bcrypt from 'bcryptjs';
import { AppError } from '../utils/AppError.js';

export class UserCreateService {
  constructor(userRepository) {
    this.userRepo = userRepository;
  }

  /**
   * @description Create a new user in database.
   * @param {String} name
   * @param {String} email
   * @param {String} password
   * @returns {Promise<Object>}
   */
  async exec({ name, email, password }) {
    if (!name) {
      throw new AppError('Nome é obrigatório.');
    }

    if (!password) {
      throw new AppError('Senha é obrigatório.');
    }

    if (!email) {
      throw new AppError('Email é obrigatório.');
    }

    const userExists = await this.userRepo.findByEmail(email);

    if (userExists) {
      throw new AppError('Este email já está sendo utilizado!');
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    try {
      const userCreated = await this.userRepo.create({
        name,
        email,
        password: hashedPassword,
      });

      return userCreated;
    } catch (error) {
      throw new AppError('Erro ao cadastrar novo usuário.', 500);
    }
  }
}
