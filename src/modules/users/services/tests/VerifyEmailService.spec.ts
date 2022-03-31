import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import VerifyEmailService from '@modules/users/services/VerifyEmailService';

import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let verifyEmailService: VerifyEmailService;

describe('VerifyEmailService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    verifyEmailService = new VerifyEmailService(fakeUsersRepository);
  });

  it('should be able to verify email of an user', async () => {
    const email = 'newuser@email.com';

    const user = await fakeUsersRepository.create({
      email,
      name: 'Fake Name',
      password: '123456',
      username: 'fakeuser',
    });

    await verifyEmailService.execute({
      email,
      code: user.code,
    });

    expect(user.email_verified).toBeTruthy();
  });

  it('should not be able to verify email of a non-existing user', async () => {
    const email = 'newuser@email.com';

    await expect(
      verifyEmailService.execute({
        email,
        code: 123456,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to verify email of an user with wrong code', async () => {
    const email = 'newuser@email.com';

    await fakeUsersRepository.create({
      email,
      name: 'Fake Name',
      password: '123456',
      username: 'fakeuser',
    });

    await expect(
      verifyEmailService.execute({
        email,
        code: 110001,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
