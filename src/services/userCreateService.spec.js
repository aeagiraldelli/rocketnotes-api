import { UserCreateService } from './UserCreateService.js';
import { UserRepositoryInMemory } from '../repositories/UserRepositoryInMemory.js';
import { AppError } from '../utils/AppError.js';

describe('UserCreateService', () => {
  const userRepoInMemory = new UserRepositoryInMemory();
  const service = new UserCreateService(userRepoInMemory);

  it('should create a user.', async () => {
    const user = {
      name: 'User Name Test',
      email: 'useremailtest@emailtest.com',
      password: '123',
    };

    const createdUser = await service.exec(user);

    expect(createdUser).toHaveProperty('id');
  });

  it('should not create a user without name parameter', async () => {
    const user = {
      email: 'useremailtest@emailtest.com',
      password: '123',
    };

    try {
      await service.exec(user);
    } catch (error) {
      expect(error instanceof AppError).toBe(true);
    }
  });

  it('should not create a user without email parameter', async () => {
    const user = {
      name: 'User Name Test',
      password: '123',
    };

    try {
      await service.exec(user);
    } catch (error) {
      expect(error instanceof AppError).toBe(true);
    }
  });

  it('should not create a user without password parameter', async () => {
    const user = {
      name: 'User Name Test',
      email: 'useremailtest@emailtest.com',
    };

    try {
      await service.exec(user);
    } catch (error) {
      expect(error instanceof AppError).toBe(true);
    }
  });

  it('should not create a user with email in use', async () => {
    const user = {
      name: 'User Name Test',
      email: 'useremailtest@emailtest.com',
      password: '123',
    };

    try {
      await service.exec(user);
    } catch (error) {
      expect(error instanceof AppError).toBe(true);
    }
  });
});
