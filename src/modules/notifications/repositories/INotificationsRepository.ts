import ICreateNotificationDTO, {
  TypeNotification,
} from '../dtos/ICreateNotificationDTO';

export default interface INotificationsRepository {
  create<T extends TypeNotification>(
    type: T,
    data: ICreateNotificationDTO<T>,
  ): Promise<void>;
  delete(notification_id: string): Promise<void>;
}
