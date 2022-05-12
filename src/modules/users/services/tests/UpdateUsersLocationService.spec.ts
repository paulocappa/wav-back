import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import AppError from '@shared/errors/AppError';
import UpdateUsersLocationService from '../UpdateUsersLocationService';

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let updateUsersLocationService: UpdateUsersLocationService;

describe('UpdateUsersLocationService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    updateUsersLocationService = new UpdateUsersLocationService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to update an user location', async () => {
    const user = await fakeUsersRepository.create({
      name: 'user-fake-1',
      username: 'userfake',
      email: 'userfake@email.com',
      password: 'fake123',
    });

    await updateUsersLocationService.execute({
      user_id: String(user.id),
      coordinates: [0, 0],
    });

    expect(user).toHaveProperty('location');
    expect(user.location).toEqual({
      type: 'Point',
      coordinates: [0, 0],
    });
  });

  it('should not be able to update an user location with invalid user id', async () => {
    await expect(
      updateUsersLocationService.execute({
        user_id: 'invalid-user-id',
        coordinates: [0, 0],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
