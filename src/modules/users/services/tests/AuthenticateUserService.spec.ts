import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeRefreshTokenRepository from '@modules/users/repositories/fakes/FakeRefreshTokenRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeTokenProvider from '@modules/users/providers/TokenProvider/fakes/FakeTokenProvider';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeRefreshTokenRepository: FakeRefreshTokenRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let fakeTokenProvider: FakeTokenProvider;
let authenticateUserService: AuthenticateUserService;

describe('AuthenticateUserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
    fakeRefreshTokenRepository = new FakeRefreshTokenRepository();
    fakeTokenProvider = new FakeTokenProvider();

    authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeRefreshTokenRepository,
      fakeHashProvider,
      fakeCacheProvider,
      fakeTokenProvider,
    );
  });

  it('should be able to authenticate an user with correct data', async () => {
    const email = 'userfake1@email.com';
    const password = 'fake-password';

    const user = await fakeUsersRepository.create({
      name: 'user-fake-1',
      username: 'userfake',
      email,
      password,
    });

    const auth = await authenticateUserService.execute({
      email,
      password,
    });

    expect(auth).toHaveProperty('tokens');
    expect(auth.user).toEqual(user);
  });

  it('should not be able to authenticate a non-existing user', async () => {
    await expect(
      authenticateUserService.execute({
        email: 'non-existing-email',
        password: 'non-existing-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate an user with wrong password', async () => {
    const email = 'userfake1@email.com';
    const password = 'fake-password';

    await fakeUsersRepository.create({
      name: 'user-fake-1',
      username: 'userfake',
      email,
      password,
    });

    await expect(
      authenticateUserService.execute({
        email,
        password: 'non-existing-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
