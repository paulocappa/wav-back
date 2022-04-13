import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { instanceToPlain } from 'class-transformer';

import CreatePublishService from '@modules/publishes/services/CreatePublishService';
import DeletePublishService from '@modules/publishes/services/DeletePublishService';

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

  public async delete(req: Request, res: Response): Promise<Response> {
    const { user_id } = req;
    const { publish_id } = req.params;

    const deletePublishService = container.resolve(DeletePublishService);

    await deletePublishService.execute({ user_id, publish_id });

    return res.status(204).json();
  }
}

export default PublishesController;
