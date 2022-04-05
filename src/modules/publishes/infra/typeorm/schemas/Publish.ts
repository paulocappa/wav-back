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

interface IReceivers {
  user_id: ObjectId;
  to_world: boolean;
}

interface IReceiversSeen extends IReceivers {
  reaction: string | null;
  created_at: Date;
}

interface IBanInfo {
  banned: boolean;
  reason: string | null;
}

interface IGeometry {
  type: 'Point';
  coordinates: number[];
}

@Entity('publishes')
export default class Publish {
  @ObjectIdColumn()
  @Transform(({ value }) => String(value))
  id: ObjectId;

  @Column()
  user_id: ObjectId;

  @Column('array')
  @Transform(({ value }) =>
    value.map((v: IReceivers) => ({ ...v, user_id: String(v.user_id) })),
  )
  receivers: IReceivers[];

  @Column()
  @Transform(({ value }) =>
    value.map((v: IReceiversSeen) => ({ ...v, user_id: String(v.user_id) })),
  )
  receivers_seen: IReceiversSeen[] = [];

  @Column('array')
  @Transform(({ value }) => value.map((v: ObjectId) => String(v)))
  reports: ObjectId[] = [];

  @Column({ nullable: true })
  text: string = null;

  @Column()
  file: string;

  @Column()
  watermark = false;

  @Column('json')
  ban_info: IBanInfo = { banned: false, reason: null };

  @Column('geometry', { nullable: true })
  location: IGeometry = null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @Expose({ name: 'publish_url' })
  get publish_url(): string | null {
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
