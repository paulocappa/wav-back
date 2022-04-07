import {
  Entity,
  ObjectIdColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { instanceToPlain, Transform, Type } from 'class-transformer';

import { ObjectId } from 'bson';

import User, {
  UserExposeFieldsName,
} from '@modules/users/infra/typeorm/schemas/User';

import transformLookup from '@shared/utils/transformLookup';

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

  @Type(() => User)
  @Transform(
    ({ value, obj, key }) => {
      return transformLookup({
        value: instanceToPlain(value),
        obj,
        key,
        expose_fields: UserExposeFieldsName,
      });
    },
    { toClassOnly: true },
  )
  user_following: User;

  @Type(() => User)
  @Transform(
    ({ value, obj, key }) => {
      return transformLookup({
        value: instanceToPlain(value),
        obj,
        key,
        expose_fields: UserExposeFieldsName,
      });
    },
    { toClassOnly: true },
  )
  user_follower: User;
}
