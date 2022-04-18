type Fields =
  | 'count_publishes'
  | 'count_reactions'
  | 'count_followers'
  | 'count_views'
  | 'count_following';

export type FieldsToUpdate = {
  field: Fields;
  count: number;
};

export default interface IIncrementManyUsersCountDTO {
  user_id: string;
  fieldsToUpdate: FieldsToUpdate[];
}
