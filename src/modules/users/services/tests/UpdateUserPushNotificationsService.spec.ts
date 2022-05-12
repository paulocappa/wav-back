import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import AppError from '@shared/errors/AppError';
import UpdateUserPushNotificationsService from '../UpdateUserPushNotificationsService';

let fakeUsersRepository: FakeUsersRepository;
let updateUserPushNotificationsService: UpdateUserPushNotificationsService;

describe('UpdateUserPushNotificationsService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    updateUserPushNotificationsService = new UpdateUserPushNotificationsService(
      fakeUsersRepository,
    );
  });

  it('should be able to update an user notification settings', async () => {
    const user = await fakeUsersRepository.create({
      name: 'user-fake-1',
      username: 'userfake',
      email: 'userfake@email.com',
      password: 'fake123',
    });

    await updateUserPushNotificationsService.execute({
      user_id: String(user.id),
      data: {
        direct: false,
        world: false,
      },
    });

    const settings = {
      world: false,
      follower: true,
      direct: false,
      reactions: true,
      new_follower: true,
    };

    expect(user).toHaveProperty('push_settings');
    expect(user.push_settings).toEqual(settings);
  });

  it('should not be able to update an user notification with invalid user id', async () => {
    await expect(
      updateUserPushNotificationsService.execute({
        user_id: 'invalid-user-id',
        data: {
          direct: false,
          world: false,
        },
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
