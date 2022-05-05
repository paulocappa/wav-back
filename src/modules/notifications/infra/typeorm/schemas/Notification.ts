import { ObjectId } from 'bson';
import { Transform } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  ObjectIdColumn,
} from 'typeorm';

type RecordsDocument = {
  user_id: ObjectId;
  created_at: Date;
};

export type NotificationRecordFollow = RecordsDocument & {
  type: 'follow';
};

export type NotificationRecordReaction = RecordsDocument & {
  type: 'reaction';
  publish_id: ObjectId;
  reaction: string;
};

type INotificationsRecords =
  | NotificationRecordFollow
  | NotificationRecordReaction;

@Entity('notifications')
export default class Notification {
  @ObjectIdColumn()
  @Transform(({ value }) => String(value))
  id: ObjectId;

  @Column()
  user_id: ObjectId;

  @Column()
  records: INotificationsRecords[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
