import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { instanceToPlain } from 'class-transformer';

import CreatePublishService from '@modules/publishes/services/CreatePublishService';

class PublishesController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { user_id, file } = req;
    const { text, watermark, location, direct_users = [] } = req.body;

    const createPublishService = container.resolve(CreatePublishService);

    const publish = await createPublishService.execute({
      user_id,
      publishFilename: file.filename,
      text,
      watermark,
      direct_users,
      location,
    });

    return res.json(instanceToPlain(publish));
  }
}

export default PublishesController;
