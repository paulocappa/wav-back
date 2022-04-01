import { inject, injectable } from 'tsyringe';
import IQueueProvider from '@shared/container/providers/QueueProvider/models/IQueueProvider';

@injectable()
class Queue {
  constructor(
    @inject('QueueProvider')
    private queueProvider: IQueueProvider,
  ) {}

  public async process(): Promise<void> {
    await this.queueProvider.process();
  }
}

export default Queue;
