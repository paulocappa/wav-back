import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import GetUserInfoService from '../GetUserInfoService';

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let getUserInfoService: GetUserInfoService;

describe('GetUserInfoService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    getUserInfoService = new GetUserInfoService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to get the same user data', async () => {
    const email = 'userfake1@email.com';
    const password = 'fake-password';

    const user = await fakeUsersRepository.create({
      name: 'user-fake-1',
      username: 'userfake',
      email,
      password,
    });

    const userData = await getUserInfoService.execute({
      user_id: String(user.id),
    });

    expect(user).toEqual(userData);
  });
});
