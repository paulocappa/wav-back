export type TypeNotification = 'reaction' | 'follow';

interface IRecord {
  user_id: string;
  to_user_id: string;
}

interface ICreateReactionNotificationDTO extends IRecord {
  reaction: string;
  publish_id: string;
}

type ICreateFollowNotificationDTO = IRecord;

type ICreateNotificationDTO<T extends TypeNotification> = T extends 'reaction'
  ? ICreateReactionNotificationDTO
  : ICreateFollowNotificationDTO;

export default ICreateNotificationDTO;
