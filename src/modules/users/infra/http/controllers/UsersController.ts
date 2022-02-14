import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { instanceToPlain } from 'class-transformer';

import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import UsersValidation from '../validations/UsersValidation';

class UsersController {
  public async create(req: Request, res: Response): Promise<Response> {
    await new UsersValidation().create(req.body);

    const { name, email, username, password } = req.body;

    const createUserService = container.resolve(CreateUserService);

    const user = await createUserService.execute({
      name,
      email,
      username,
      password,
    });

    return res.json(instanceToPlain(user));
  }

  public async update(req: Request, res: Response): Promise<Response> {
    await new UsersValidation().update(req.body);

    const {
      name,
      username,
      email,
      old_password,
      new_password,
      confirm_password,
    } = req.body;

    const { user_id } = req;

    const updateProfileService = container.resolve(UpdateProfileService);

    const user = await updateProfileService.execute({
      user_id,
      name,
      username,
      email,
      old_password,
      new_password,
      confirm_password,
    });

    return res.json(instanceToPlain(user));
  }
}

export default UsersController;
