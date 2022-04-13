type Fields =
  | 'count_publishes'
  | 'count_reactions'
  | 'count_followers'
  | 'count_following';

export default interface IDecrementCountUserField {
  field: Fields;
  count: number;
}
