import { v4 as uuid } from 'uuid';

import { ObjectId } from 'bson';

import {
  Entity,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user_tokens')
export default class UserToken {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  token: string = uuid();

  @Column()
  user_id: ObjectId;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
