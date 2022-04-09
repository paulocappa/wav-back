import { MongoRepository } from 'typeorm';
import Follower from '../infra/typeorm/schemas/Follower';

interface IData {
  user_id: string;
}

interface IPageData {
  page: number;
  per_page: number;
}

export type IListData = IData & IPageData;

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
  get followersOrmRepository(): MongoRepository<Follower>;
  follow(data: IFollowData): Promise<Follower>;
  unfollow(data: IUnfollowData): Promise<void>;
  isFollowing(data: IIsFollowingData): Promise<Follower>;
  getFollowers(data: IListData): Promise<Follower[]>;
  getFollowing(data: IListData): Promise<Follower[]>;
  removeAllFollowers(user_id: string): Promise<number>;
  removeAllFollowing(user_id: string): Promise<number>;
}
