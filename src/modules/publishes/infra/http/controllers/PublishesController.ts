import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { instanceToPlain } from 'class-transformer';

import CreatePublishService from '@modules/publishes/services/CreatePublishService';

class PublishesController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { user_id, file } = req;
    const { text, watermark } = req.body;

    const coordinates = [-46.4377097, -23.6532187];
    const receivers = [
      { user_id: '624c7928db61628ad0cad352', to_world: false },
    ];

    const createPublishService = container.resolve(CreatePublishService);

    const publish = await createPublishService.execute({
      user_id,
      publishFilename: file.filename,
      text,
      watermark,
      receivers,
      coordinates,
    });

    return res.json(instanceToPlain(publish));
  }
}

export default PublishesController;
