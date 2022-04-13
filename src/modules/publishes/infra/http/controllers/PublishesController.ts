import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { instanceToPlain } from 'class-transformer';

import CreatePublishService from '@modules/publishes/services/CreatePublishService';

class PublishesController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { user_id } = req;

    const {
      filename,
      text,
      location,
      watermark = false,
      to_world = false,
      direct_users = [],
    } = req.body;

    const createPublishService = container.resolve(CreatePublishService);

    const publish = await createPublishService.execute({
      user_id,
      filename,
      text,
      watermark,
      direct_users,
      location,
      to_world,
    });

    return res.json(instanceToPlain(publish));
  }
}

export default PublishesController;
