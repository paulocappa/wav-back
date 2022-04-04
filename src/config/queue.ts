import BullQueueProvider from '@shared/container/providers/QueueProvider/implementations/BullQueueProvider';

interface IQueueConfig {
  driver: 'bull';

  config: {
    bull: {
      instance: typeof BullQueueProvider;
    };
  };
}

export default {
  driver: 'bull',

  config: {
    bull: {
      instance: BullQueueProvider,
    },
  },
} as IQueueConfig;
