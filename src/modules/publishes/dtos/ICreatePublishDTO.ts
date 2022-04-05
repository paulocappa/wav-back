export interface IReceivers {
  to_world: boolean;
  user_id: string;
}

export default interface ICreatePublishDTO {
  user_id: string;
  text: string | null;
  watermark: boolean;
  receivers: IReceivers[];
  coordinates: number[];
  file: string;
}
