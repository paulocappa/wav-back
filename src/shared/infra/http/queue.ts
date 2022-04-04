import 'reflect-metadata';
import 'dotenv/config';

import '@shared/container';

import queueConfig from '@config/queue';

const QueueInstance = queueConfig.config.bull.instance;

function startQueue() {
  setTimeout(async () => {
    await new QueueInstance().process();
  }, 3000);
}

startQueue();
