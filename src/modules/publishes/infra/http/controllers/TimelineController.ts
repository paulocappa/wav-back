import { container } from 'tsyringe';
import { Request, Response } from 'express';

import ListTimelinePublishesService from '@modules/publishes/services/ListTimelinePublishesService';
import type { ListType } from '@modules/publishes/dtos/IListRecentPublishesDTO';

class TimelineController {
  public async list(req: Request, res: Response): Promise<Response> {
    const { user_id } = req;
    const { list_type, page = 1, per_page = 10 } = req.query;

    const listTimelinePublishesService = container.resolve(
      ListTimelinePublishesService,
    );

    const publishes = await listTimelinePublishesService.execute({
      user_id,
      list_type: list_type as ListType,
      page: Number(page),
      per_page: Number(per_page),
    });

    return res.json(publishes);
  }
}

export default TimelineController;
