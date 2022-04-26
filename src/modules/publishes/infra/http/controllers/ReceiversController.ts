import ListPublishReceiversSeenService from '@modules/publishes/services/ListPublishReceiversSeenService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class ReceiversController {
  public async list(req: Request, res: Response): Promise<Response> {
    const { user_id } = req;
    const { publish_id } = req.params;
    const { page = 1, per_page = 10 } = req.query;

    const listPublishReceiversSeenService = container.resolve(
      ListPublishReceiversSeenService,
    );

    const receivers = await listPublishReceiversSeenService.execute({
      user_id,
      publish_id,
      page: Number(page),
      per_page: Number(per_page),
    });

    return res.json(receivers);
  }
}

export default ReceiversController;
