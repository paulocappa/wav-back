import Follower from '../infra/typeorm/schemas/Follower';

interface IData {
  user_id: string;
}

export interface IFollowData extends IData {
  user_to_follow_id: string;
}

export interface IUnfollowData extends IData {
  user_to_unfollow_id: string;
}

export interface IIsFollowingData extends IData {
  following_user_id: string;
}

export default interface IFollowersRepository {
  follow({ user_id, user_to_follow_id }: IFollowData): Promise<Follower>;
  unfollow({ user_id, user_to_unfollow_id }: IUnfollowData): Promise<void>;
  isFollowing({
    user_id,
    following_user_id,
  }: IIsFollowingData): Promise<Follower>;
  getFollowers(user_id: string): Promise<Follower[]>;
  getFollowing(user_id: string): Promise<Follower[]>;
}
