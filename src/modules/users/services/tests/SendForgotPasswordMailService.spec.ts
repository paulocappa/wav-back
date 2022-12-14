import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeQueueProvider from '@shared/container/providers/QueueProvider/fakes/FakeQueueProvider';
import SendForgotPasswordMailService from '@modules/users/services/SendForgotPasswordMailService';

import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeMailProvider: FakeMailProvider;
let fakeQueueProvider: FakeQueueProvider;
let sendForgotPasswordMailService: SendForgotPasswordMailService;

describe('SendForgotPasswordMailService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeQueueProvider = new FakeQueueProvider();

    sendForgotPasswordMailService = new SendForgotPasswordMailService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeMailProvider,
      fakeQueueProvider,
    );
  });

  it('should be able to recover the password with the email', async () => {
    const addToQueue = jest.spyOn(fakeQueueProvider, 'add');

    await fakeUsersRepository.create({
      name: 'Fake User',
      username: 'fake',
      email: 'fakeuser@gmail.com',
      password: 'pass123',
    });

    await sendForgotPasswordMailService.execute({
      email: 'fakeuser@gmail.com',
    });

    expect(addToQueue).toHaveBeenCalled();
  });

  it('should not be able to recover a non-existing user password', async () => {
    await expect(
      sendForgotPasswordMailService.execute({
        email: 'non-existing@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const generateTokenFn = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'Fake User',
      username: 'fake',
      email: 'fakeuser@gmail.com',
      password: 'pass123',
    });

    await sendForgotPasswordMailService.execute({
      email: 'fakeuser@gmail.com',
    });

    expect(generateTokenFn).toHaveBeenCalledWith(String(user.id));
  });
});
