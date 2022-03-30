import {
  ObjectID,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
} from 'typeorm';

import uploadConfig from '@config/upload';

import { Exclude, Expose, Transform } from 'class-transformer';
import { ObjectId } from 'bson';

import generateRandomNumber from '@shared/utils/generateRandomNumber';

@Entity('users')
export default class User {
  @ObjectIdColumn()
  @Transform(({ value }) => String(value))
  id: ObjectID;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  @Transform(({ value }) => `@${value}`)
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column('string', { nullable: true })
  avatar: string = null;

  @Column('number')
  count_publishes = 0;

  @Column('number')
  count_reactions = 0;

  @Column('number')
  count_followers = 0;

  @Column('number')
  count_following = 0;

  @Column('number')
  coins = 0;

  @Column('number')
  range = 50;

  @Column()
  @Exclude()
  code: number = generateRandomNumber();

  @Column('boolean')
  @Exclude()
  email_verified = false;

  @Exclude()
  @Column('boolean')
  administrator = false;

  @Column('array')
  @Transform(({ value }) => value.map((v: ObjectId) => String(v)))
  blocked_users: ObjectId[] = [];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: 'avatar_url' })
  get avatar_url(): string | null {
    if (!this.avatar) return null;

    const { driver, config } = uploadConfig;

    switch (driver) {
      case 'disk':
        return `${process.env.API_URL}/file/${this.avatar}`;
      case 's3':
        return `${config.s3.url}/${this.avatar}`;
      default:
        return null;
    }
  }
}
