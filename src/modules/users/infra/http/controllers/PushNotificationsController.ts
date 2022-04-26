import UpdateUserPushNotificationsService from '@modules/users/services/UpdateUserPushNotificationsService';
import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class PushNotificationsController {
  public async update(req: Request, res: Response): Promise<Response> {
    const { user_id } = req;

    const pushNotificationsToUpdate: Record<string, boolean> = {};

    Object.entries(req.body).forEach(([key, value]) => {
      if (value) {
        pushNotificationsToUpdate[key] = true;
      }
    });

    const updateUserPushNotificationsService = container.resolve(
      UpdateUserPushNotificationsService,
    );

    const user = await updateUserPushNotificationsService.execute({
      user_id,
      data: pushNotificationsToUpdate,
    });

    return res.json(instanceToPlain(user));
  }
}

export default PushNotificationsController;
