import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';

import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfileService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the profile without changing the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Fake User',
      username: 'fakeuser',
      email: 'fakeuser@email.com',
      password: '123456',
    });

    const newUserData = {
      name: 'User Fake',
      username: '__fakeuser',
      email: 'userfake@email.com',
    };

    await updateProfileService.execute({
      user_id: String(user.id),
      ...newUserData,
    });

    expect(user).toMatchObject(newUserData);
  });

  it('should not be able to change profile of a non-existing user', async () => {
    await expect(
      updateProfileService.execute({
        user_id: 'non-existing-user',
        name: 'User Fake',
        username: '__fakeuser',
        email: 'userfake@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change the email for another alredy in use', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'Fake User',
      username: 'fakeuser',
      email: 'fakeuser@email.com',
      password: '123456',
    });

    await fakeUsersRepository.create({
      name: 'Fake User 2',
      username: 'fakeuser2',
      email: 'emailtochange@email.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: String(user1.id),
        name: 'Fake User',
        username: 'fakeuser',
        email: 'emailtochange@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change the username for another alredy in use', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'Fake User',
      username: 'fakeuser',
      email: 'fakeuser@email.com',
      password: '123456',
    });

    await fakeUsersRepository.create({
      name: 'Fake User 2',
      username: 'username',
      email: 'fakeuser2@email.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: String(user1.id),
        name: 'Fake User',
        username: 'username',
        email: 'fakeuser@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change the password without providing the old_password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Fake User',
      username: 'fakeuser',
      email: 'fakeuser@email.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: String(user.id),
        name: 'Fake User',
        username: 'fakeuser',
        email: 'fakeuser@email.com',
        new_password: 'mynewpassword',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change the password when the field "new_password" does not match the field "confirm_password"', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Fake User',
      username: 'fakeuser',
      email: 'fakeuser@email.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: String(user.id),
        name: 'Fake User',
        username: 'fakeuser',
        email: 'fakeuser@email.com',
        old_password: '123456',
        new_password: 'mynewpassword',
        confirm_password: 'wrongpassword',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to change the password', async () => {
    const hashFn = jest.spyOn(fakeHashProvider, 'generateHash');

    const user = await fakeUsersRepository.create({
      name: 'Fake User',
      username: 'fakeuser',
      email: 'fakeuser@email.com',
      password: '123456',
    });

    const newUserData = await updateProfileService.execute({
      user_id: String(user.id),
      name: 'Fake User',
      username: 'fakeuser',
      email: 'fakeuser@email.com',
      old_password: '123456',
      new_password: 'mynewpassword',
      confirm_password: 'mynewpassword',
    });

    expect(hashFn).toHaveBeenCalledWith('mynewpassword');

    expect(user.password).toBe(newUserData.password);
  });

  it('should not be able to change the password when with incorret password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Fake User',
      username: 'fakeuser',
      email: 'fakeuser@email.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: String(user.id),
        name: 'Fake User',
        username: 'fakeuser',
        email: 'fakeuser@email.com',
        old_password: 'wrongpassword',
        new_password: 'mynewpassword',
        confirm_password: 'mynewpassword',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password without providing the new password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Fake User',
      username: 'fakeuser',
      email: 'fakeuser@email.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: String(user.id),
        name: 'Fake User',
        username: 'fakeuser',
        email: 'fakeuser@email.com',
        old_password: 'wrongpassword',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password without providing the confirm password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Fake User',
      username: 'fakeuser',
      email: 'fakeuser@email.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: String(user.id),
        name: 'Fake User',
        username: 'fakeuser',
        email: 'fakeuser@email.com',
        old_password: 'wrongpassword',
        new_password: 'mynewpassword',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
