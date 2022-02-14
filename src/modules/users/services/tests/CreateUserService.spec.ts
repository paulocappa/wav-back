import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import CreateUserService from '@modules/users/services/CreateUserService';

import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;

describe('CreateUserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to create a new user', async () => {
    const email = 'newuser@email.com';

    const user = await createUserService.execute({
      name: 'new-user',
      email,
      username: 'username',
      password: 'newuser',
    });

    expect(user).toHaveProperty('id');
    expect(user.email).toBe(email);
  });

  it('should not be able to create a new user with an email in use', async () => {
    const email = 'newuser@email.com';

    await createUserService.execute({
      name: 'new-user',
      email,
      username: 'username',
      password: 'newuser',
    });

    await expect(
      createUserService.execute({
        name: 'new-user-2',
        email,
        username: 'username2',
        password: 'newuser2',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new user with an username in use', async () => {
    const username = 'newuserusername';

    await fakeUsersRepository.create({
      name: 'new-user',
      email: 'emailuser@email.com',
      username,
      password: 'newuser',
    });

    await expect(
      createUserService.execute({
        name: 'new-user-2',
        email: 'emailuser2@email.com',
        username,
        password: 'newuser2',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
