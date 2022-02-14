import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { instanceToPlain } from 'class-transformer';

import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import AvatarValidation from '../validations/AvatarValidation';

class AvatarController {
  public async update(req: Request, res: Response): Promise<Response> {
    await new AvatarValidation().update(req);

    const { user_id, file } = req;

    const updateUserAvatar = container.resolve(UpdateUserAvatarService);

    const user = await updateUserAvatar.execute({
      user_id,
      avatarFilename: file.filename,
    });

    return res.json(instanceToPlain(user));
  }
}

export default AvatarController;
