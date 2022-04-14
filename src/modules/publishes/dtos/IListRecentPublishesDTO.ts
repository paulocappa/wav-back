export type ListType = 'world' | 'follower' | 'direct';

export default interface IListRecentPublishesDTO {
  user_id: string;
  list_type: ListType;
  page: number;
  per_page: number;
}
