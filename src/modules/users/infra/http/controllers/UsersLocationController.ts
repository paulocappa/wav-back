import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateUsersLocationService from '@modules/users/services/UpdateUsersLocationService';
import { instanceToPlain } from 'class-transformer';

class UsersLocationController {
  public async update(req: Request, res: Response): Promise<Response> {
    const { latitude, longitude } = req.body;

    const updateUserLocationService = container.resolve(
      UpdateUsersLocationService,
    );

    const user = await updateUserLocationService.execute({
      user_id: req.user_id,
      coordinates: [longitude, latitude],
    });

    return res.json(instanceToPlain(user));
  }
}

export default UsersLocationController;
