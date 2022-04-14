import {
  Entity,
  ObjectIdColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

import { Transform } from 'class-transformer';

import { ObjectId } from 'bson';

@Entity('followers')
export default class Follower {
  @ObjectIdColumn()
  @Transform(({ value }) => String(value))
  id: ObjectId;

  @Column()
  @Transform(({ value }) => String(value))
  user_id: ObjectId;

  @Column()
  @Transform(({ value }) => String(value))
  following: ObjectId;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
