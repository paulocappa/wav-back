export type SeenData = {
  publish_id: string;
  reaction: string | null;
};

export default interface IUpdatePublishSeenDTO {
  user_id: string;
  seen_data: SeenData[];
}
