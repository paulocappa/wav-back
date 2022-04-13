import type { IWaveSeen } from '../infra/typeorm/schemas/Publish';

export default interface ICreatePublishDTO {
  user_id: string;
  text: string | null;
  watermark: boolean;
  followers_receivers: IWaveSeen[];
  direct_receivers: IWaveSeen[];
  range: number;
  location: {
    type: 'Point';
    coordinates: [number, number];
  } | null;
  file: string;
  to_world: boolean;
}
