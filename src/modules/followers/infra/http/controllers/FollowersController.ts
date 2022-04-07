import { Request, Response } from 'express';

import { container } from 'tsyringe';
import { instanceToPlain, plainToInstance } from 'class-transformer';

import AppError from '@shared/errors/AppError';

import IncrementFollowersCountService from '@modules/users/services/IncrementFollowersCountService';
import IncrementFollowingCountService from '@modules/users/services/IncrementFollowingCountService';

import Follower from '@modules/followers/infra/typeorm/schemas/Follower';
import FollowUserService from '@modules/followers/services/FollowUserService';
import UnfollowUserService from '@modules/followers/services/UnfollowUserService';
import ListFollowersUserService from '@modules/followers/services/ListFollowersUserService';
import ListFollowingUserService from '@modules/followers/services/ListFollowingUserService';

class FollowersController {
  public async index(req: Request, res: Response): Promise<Response> {
    const { list_type, page = 1, per_page = 10 } = req.query;

    let listFollowService: ListFollowersUserService | ListFollowingUserService;

    switch (list_type) {
      case 'followers':
        listFollowService = container.resolve(ListFollowersUserService);
        break;
      case 'following':
        listFollowService = container.resolve(ListFollowingUserService);
        break;
      default:
        throw new AppError('List type must be provided');
    }

    const list = await listFollowService.execute({
      user_id: req.user_id,
      page: page as string,
      per_page: per_page as string,
    });

    return res.json(plainToInstance(Follower, list));
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const { user_follow } = req.body;

    const followUserService = container.resolve(FollowUserService);
    const incrementFollowersCountService = container.resolve(
      IncrementFollowersCountService,
    );
    const incrementFollowingCountService = container.resolve(
      IncrementFollowingCountService,
    );

    const follow = await followUserService.execute({
      user_id: req.user_id,
      user_follow,
    });

    await incrementFollowersCountService.execute(user_follow);
    await incrementFollowingCountService.execute(req.user_id);

    return res.json(instanceToPlain(follow));
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const unfollowUserService = container.resolve(UnfollowUserService);

    await unfollowUserService.execute({
      user_id: req.user_id,
      user_follow: req.params.id,
    });

    return res.status(204).json();
  }
}

export default FollowersController;
