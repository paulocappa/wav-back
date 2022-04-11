import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateUsersLocationService from '@modules/users/services/UpdateUsersLocationService';

class UsersLocationController {
  public async update(req: Request, res: Response): Promise<Response> {
    const { latitude, longitude } = req.body;

    const updateUserLocationService = container.resolve(
      UpdateUsersLocationService,
    );

    await updateUserLocationService.execute({
      user_id: req.user_id,
      coordinates: [longitude, latitude],
    });

    return res.status(204).json();
  }
}

export default UsersLocationController;
