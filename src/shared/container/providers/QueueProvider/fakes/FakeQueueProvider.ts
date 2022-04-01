import IQueueProvider, { JobData, JobsKey } from '../models/IQueueProvider';

interface IQueuesData {
  key: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

class FakeQueueProvider implements IQueueProvider {
  private queues: IQueuesData[] = [];

  public async add<T extends JobsKey>(key: T, data: JobData<T>): Promise<void> {
    this.queues.push({ key, data });
  }

  public async process(): Promise<void> {
    this.queues.forEach(queue => {
      const index = this.queues.findIndex(q => q.key === queue.key);

      this.queues.splice(index, 1);
    });
  }
}

export default FakeQueueProvider;
