import {
  ObjectID,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
} from 'typeorm';

import { Exclude, Expose, Transform } from 'class-transformer';
import { ObjectId } from 'bson';

import uploadConfig from '@config/upload';

import generateRandomNumber from '@shared/utils/generateRandomNumber';
import formatNumber from '@shared/utils/formatNumber';

export type UserBadges = 'VERIFIED' | 'STREAMER' | 'YOUTUBER' | 'INFLUENCER';

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

export const UserExposeFieldsName = [
  { reference: 'avatar', field: 'avatar_url' },
  { reference: 'count_followers', field: 'formatted_count_followers' },
  { reference: 'count_following', field: 'formatted_count_following' },
] as const;
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
  @Transform(({ value }) => `@${value}`, { toPlainOnly: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  avatar: string;

  @Column()
  count_publishes: number;

  @Column()
  count_reactions: number;

  @Column()
  count_followers: number;

  @Column()
  count_following: number;

  @Column()
  coins: number;

  @Column()
  range: number;

  @Column()
  @Exclude()
  code: number;

  @Column()
  email_verified: boolean;

  @Exclude()
  @Column()
  administrator: boolean;

  @Column()
  language: string;

  @Column()
  badges: UserBadges[];

  @Column()
  ban_info: IBanInfo;

  @Column()
  push_settings: IPushSettings;

  @Column()
  @Transform(({ value }) => value.map((v: ObjectId) => String(v)))
  blocked_users: ObjectId[];

  @Column('datetime')
  last_action: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor() {
    this.avatar = null;
    this.count_publishes = 0;
    this.count_reactions = 0;
    this.count_followers = 0;
    this.count_following = 0;
    this.coins = 0;
    this.range = 50;
    this.code = generateRandomNumber();
    this.email_verified = false;
    this.administrator = false;
    this.language = 'pt';
    this.badges = [];
    this.ban_info = { banned: false, until: null, reason: null };
    this.push_settings = {
      world: true,
      follower: true,
      direct: true,
      reactions: true,
      new_follower: true,
    };
    this.blocked_users = [];
    this.last_action = new Date();
  }

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

  @Expose({ name: 'formatted_count_followers' })
  get formatted_followers(): string | null {
    if (this.count_followers !== 0 && !this.count_followers) return null;

    return formatNumber(this.count_followers);
  }

  @Expose({ name: 'formatted_count_following' })
  get formatted_following(): string | null {
    if (this.count_following !== 0 && !this.count_following) return null;

    return formatNumber(this.count_following);
  }
}
