import { Request, Response } from 'express';

import { container } from 'tsyringe';
import { instanceToPlain } from 'class-transformer';

import AppError from '@shared/errors/AppError';

import FollowUserService from '@modules/followers/services/FollowUserService';
import UnfollowUserService from '@modules/followers/services/UnfollowUserService';
import ListFollowersUserService from '@modules/followers/services/ListFollowersUserService';
import ListFollowingUserService from '@modules/followers/services/ListFollowingUserService';

import FollowersValidation from '../validations/FollowersValidation';

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

    return res.json(list);
  }

  public async create(req: Request, res: Response): Promise<Response> {
    await new FollowersValidation().create(req.body);

    const { user_follow } = req.body;

    const followUserService = container.resolve(FollowUserService);

    const follow = await followUserService.execute({
      user_id: req.user_id,
      user_follow,
    });

    return res.json(instanceToPlain(follow));
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    await new FollowersValidation().delete(req.params);

    const { user_id } = req;
    const user_follow = req.params.id;

    const unfollowUserService = container.resolve(UnfollowUserService);

    await unfollowUserService.execute({
      user_id,
      user_follow,
    });

    return res.status(204).json();
  }
}

export default FollowersController;
