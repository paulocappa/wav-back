import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatarService: UpdateUserAvatarService;

describe('UpdateUserAvatarService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to update an user avatar', async () => {
    const user = await fakeUsersRepository.create({
      name: 'user-fake-1',
      username: 'userfake',
      email: 'userfake@email.com',
      password: 'fake123',
    });

    await updateUserAvatarService.execute({
      user_id: String(user.id),
      avatarFilename: 'newfile.jpeg',
    });

    expect(user.avatar).toBe('newfile.jpeg');
  });

  it('should not be able to update the avatar from a non-existing user', async () => {
    await expect(
      updateUserAvatarService.execute({
        user_id: 'non-existing-user',
        avatarFilename: 'newfile.jpeg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when updating new one', async () => {
    const deleteFileFn = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'user-fake-1',
      username: 'userfake',
      email: 'userfake@email.com',
      password: 'fake123',
    });

    await updateUserAvatarService.execute({
      user_id: String(user.id),
      avatarFilename: 'newfile.jpeg',
    });

    await updateUserAvatarService.execute({
      user_id: String(user.id),
      avatarFilename: 'anotherfile.jpeg',
    });

    expect(deleteFileFn).toHaveBeenCalledWith('newfile.jpeg');

    expect(user.avatar).toBe('anotherfile.jpeg');
  });
});
