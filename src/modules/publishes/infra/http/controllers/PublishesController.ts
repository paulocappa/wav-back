import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { instanceToPlain } from 'class-transformer';

import CreatePublishService from '@modules/publishes/services/CreatePublishService';
import DeletePublishService from '@modules/publishes/services/DeletePublishService';
import UpdatePublishesSeenService from '@modules/publishes/services/UpdatePublishSeenService';
import GetPublishInfoService from '@modules/publishes/services/GetPublishInfoService';

import PublishesValidation from '../validations/PublishesValidation';

class PublishesController {
  public async index(req: Request, res: Response): Promise<Response> {
    const { user_id } = req;
    const { publish_id } = req.params;

    const getPublishInfoService = container.resolve(GetPublishInfoService);

    const publish = await getPublishInfoService.execute({
      user_id,
      publish_id,
    });

    return res.json(instanceToPlain(publish));
  }

  public async create(req: Request, res: Response): Promise<Response> {
    await new PublishesValidation().create(req.body);

    const { user_id } = req;

    const {
      filename,
      text,
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
      to_world,
    });

    return res.json(instanceToPlain(publish));
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { user_id } = req;
    const { data } = req.body;

    const updatePublishesSeenService = container.resolve(
      UpdatePublishesSeenService,
    );

    await updatePublishesSeenService.execute({
      user_id,
      seen_data: data,
    });

    return res.json();
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    await new PublishesValidation().delete(req.params);

    const { user_id } = req;
    const { publish_id } = req.params;

    const deletePublishService = container.resolve(DeletePublishService);

    await deletePublishService.execute({ user_id, publish_id });

    return res.status(204).json();
  }
}

export default PublishesController;
