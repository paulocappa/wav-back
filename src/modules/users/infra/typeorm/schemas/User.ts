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

export type USER_BADGES = 'VERIFIED' | 'STREAMER' | 'YOUTUBER' | 'INFLUENCER';

interface IBanInfo {
  banned: boolean;
  until: Date | null;
  reason: string | null;
}

interface IPushSettings {
  world: boolean;
  follower: boolean;
  reactions: boolean;
  direct: boolean;
  new_follower: boolean;
}
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
  email_verified = false;

  @Exclude()
  @Column('boolean')
  administrator = false;

  @Column('string')
  language = 'pt';

  @Column('array')
  badges: USER_BADGES[] = [];

  @Column('json')
  ban_info: IBanInfo = { banned: false, until: null, reason: null };

  @Column('json')
  push_settings: IPushSettings = {
    world: true,
    follower: true,
    direct: true,
    reactions: true,
    new_follower: true,
  };

  @Column('array')
  @Transform(({ value }) => value.map((v: ObjectId) => String(v)))
  blocked_users: ObjectId[] = [];

  @Column('datetime')
  last_action: Date = new Date();

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
