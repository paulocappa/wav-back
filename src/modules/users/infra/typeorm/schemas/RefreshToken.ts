import { Column, CreateDateColumn, Entity, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'bson';
import { Transform } from 'class-transformer';

import { addDays } from 'date-fns';

@Entity('refresh_token')
export default class RefreshToken {
  @ObjectIdColumn()
  @Transform(({ value }) => String(value))
  id: ObjectId;

  @Column()
  user_id: ObjectId;

  @Column()
  expires_in: number;

  @CreateDateColumn()
  created_at: Date;

  constructor() {
    const dateWithThirtyDays = addDays(new Date(), 30);

    this.expires_in = Math.floor(dateWithThirtyDays.getTime() / 1000);
  }
}
