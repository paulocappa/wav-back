import { inject, injectable } from 'tsyringe';
import INotificationsRepository from '../repositories/INotificationsRepository';

@injectable()
class CreateNotificationService {
  constructor(
    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
  ) {}

  public async execute(): Promise<void> {}
}

export default CreateNotificationService;
