import { Request, Response } from 'express';

import { container } from 'tsyringe';
import { instanceToPlain } from 'class-transformer';

import FollowUserService from '@modules/followers/services/FollowUserService';
import UnfollowUserService from '@modules/followers/services/UnfollowUserService';

class FollowersController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { user_follow } = req.body;

    const followUserService = container.resolve(FollowUserService);

    const follow = await followUserService.execute({
      user_id: req.user_id,
      user_follow,
    });

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
