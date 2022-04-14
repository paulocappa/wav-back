import {
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

import { Expose, Transform } from 'class-transformer';
import { ObjectId } from 'bson';

import uploadConfig from '@config/upload';

interface ISeen {
  user_id: ObjectId;
  reaction: string | null;
  seen_at: Date | null;
}

export interface IWaveSeen extends ISeen {
  seen: boolean;
  created_at: Date | null;
}

interface IBanInfo {
  banned: boolean;
  reason: string | null;
}

interface IGeometry {
  type: 'Point';
  coordinates: [number, number];
}

export const PublishExposeFieldsName = [
  { reference: 'file', field: 'publish_url' },
] as const;

@Entity('publishes')
export default class Publish {
  @ObjectIdColumn()
  @Transform(({ value }) => String(value))
  id: ObjectId;

  @Column()
  @Transform(({ value }) => String(value))
  user_id: ObjectId;

  @Column({ default: [] })
  @Transform(({ value }) =>
    value.map((v: IWaveSeen) => ({ ...v, user_id: String(v.user_id) })),
  )
  direct_receivers: IWaveSeen[];

  @Column({ default: [] })
  @Transform(({ value }) =>
    value.map((v: IWaveSeen) => ({ ...v, user_id: String(v.user_id) })),
  )
  followers_receivers: IWaveSeen[];

  @Column({ default: [] })
  @Transform(({ value }) =>
    value.map((v: ISeen) => ({ ...v, user_id: String(v.user_id) })),
  )
  receivers_seen: ISeen[];

  @Column({ default: [] })
  @Transform(({ value }) => value.map((id: ObjectId) => String(id)))
  reports: ObjectId[];

  @Column({ default: false })
  to_world: boolean;

  @Column({ nullable: true })
  range: number;

  @Column({ nullable: true, default: null })
  text: string;

  @Column()
  file: string;

  @Column({ default: false })
  watermark: boolean;

  @Column('json', { default: { banned: false, reason: null } })
  ban_info: IBanInfo;

  @Column('geometry', { nullable: true, default: null })
  location: IGeometry;

  @Column({ default: 0 })
  count_seen: number;

  @Column({ default: 0 })
  count_reactions: number;

  @Column({ default: 0 })
  count_reports: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  constructor() {
    this.direct_receivers = [];
    this.followers_receivers = [];
    this.receivers_seen = [];
    this.reports = [];
    this.text = null;
    this.watermark = false;
    this.ban_info = { banned: false, reason: null };
    this.location = null;
    this.count_seen = 0;
    this.count_reactions = 0;
    this.count_reports = 0;
    this.range = null;
    this.to_world = false;
  }

  @Expose({ name: 'publish_url' })
  publish_url(): string | null {
    if (!this.file) return null;

    const { driver, config } = uploadConfig;

    switch (driver) {
      case 'disk':
        return `${process.env.API_URL}/file/${this.file}`;
      case 's3':
        return `${config.s3.url}/${this.file}`;
      default:
        return null;
    }
  }
}
