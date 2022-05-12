import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeTokenProvider from '@modules/users/providers/TokenProvider/fakes/FakeTokenProvider';
import FakeRefreshTokenRepository from '@modules/users/repositories/fakes/FakeRefreshTokenRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';
import AuthenticateUserService from '../AuthenticateUserService';
import RefreshTokenService from '../RefreshTokenService';

let fakeUsersRepository: FakeUsersRepository;
let fakeRefreshTokenRepository: FakeRefreshTokenRepository;
let fakeTokenProvider: FakeTokenProvider;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let refreshTokenService: RefreshTokenService;
let authenticateUserService: AuthenticateUserService;

describe('RefreshTokenService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeRefreshTokenRepository = new FakeRefreshTokenRepository();
    fakeTokenProvider = new FakeTokenProvider();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();

    refreshTokenService = new RefreshTokenService(
      fakeUsersRepository,
      fakeRefreshTokenRepository,
      fakeTokenProvider,
    );

    authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeRefreshTokenRepository,
      fakeHashProvider,
      fakeCacheProvider,
      fakeTokenProvider,
    );
  });

  it('should be able to refresh the token', async () => {
    const email = 'userfake1@email.com';
    const password = 'fake-password';

    await fakeUsersRepository.create({
      name: 'user-fake-1',
      username: 'userfake',
      email,
      password,
    });

    const { tokens } = await authenticateUserService.execute({
      email,
      password,
    });

    const { refreshToken } = tokens;

    const { refreshToken: newRefreshToken } = await refreshTokenService.execute(
      refreshToken,
    );

    expect(refreshToken).not.toEqual(newRefreshToken);
  });

  it('should not be able to refresh token with invalid token', async () => {
    await expect(
      refreshTokenService.execute('invalid-token'),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to refresh token with invalid user', async () => {
    const email = 'userfake1@email.com';
    const password = 'fake-password';

    const user = await fakeUsersRepository.create({
      name: 'user-fake-1',
      username: 'userfake',
      email,
      password,
    });

    const { tokens } = await authenticateUserService.execute({
      email,
      password,
    });

    const { refreshToken } = tokens;

    await fakeUsersRepository.delete(String(user.id));

    await expect(
      refreshTokenService.execute(refreshToken),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to refresh token with expired token', async () => {
    const email = 'userfake1@email.com';
    const password = 'fake-password';

    jest.useFakeTimers('modern').setSystemTime(new Date(2020, 9, 1, 7));

    await fakeUsersRepository.create({
      name: 'user-fake-1',
      username: 'userfake',
      email,
      password,
    });

    const { tokens } = await authenticateUserService.execute({
      email,
      password,
    });

    const { refreshToken } = tokens;

    jest.useFakeTimers('modern').setSystemTime(new Date(2030, 9, 1, 7));

    await expect(
      refreshTokenService.execute(refreshToken),
    ).rejects.toBeInstanceOf(AppError);
  });
});
