import { JobsOptions, Queue, Worker, Job as BullJobData } from 'bullmq';
import cacheConfig from '@config/cache';
import IQueueProvider, { JobData, JobsKey } from '../models/IQueueProvider';

import jobs from '../jobs';

interface IQueuesData {
  instance: {
    handle({ data }: BullJobData['data']): Promise<void>;
  };
  bull: Queue;
  name: string;
  options: JobsOptions;
}

class BullQueueProvider implements IQueueProvider {
  private queues: IQueuesData[] = [];

  constructor() {
    this.queues = jobs.map(job => {
      return {
        instance: job,
        bull: new Queue(job.key, {
          connection: cacheConfig.config.redis,
        }),
        name: job.key,
        options: job.options,
      };
    });
  }

  public async add<T extends JobsKey>(key: T, data: JobData<T>): Promise<void> {
    const queue = this.queues.find(q => q.name === key);

    const { id } = await queue.bull.add(queue.name, data, queue.options);

    console.log(`Job ${id} added to queue`);
  }

  public async process(): Promise<void> {
    this.queues.forEach(queue => {
      const worker = new Worker(
        queue.name,
        async job => {
          const jobInstance = queue.instance;

          await jobInstance.handle({ data: job.data });
        },
        {
          connection: cacheConfig.config.redis,
        },
      );

      worker.on('active', job => {
        console.log('started', job.id);
      });

      worker.on('completed', job => {
        console.log(`Job ${job.id} has finished`);
      });

      worker.on('failed', (job, err) => {
        console.log('Job Failed', job.id);
        console.error(err);
      });
    });
  }
}

export default BullQueueProvider;
