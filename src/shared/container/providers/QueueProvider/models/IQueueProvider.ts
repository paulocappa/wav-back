import type { JobKey as RegistrationMailJob } from '@modules/users/dtos/RegistrationMailDTO';
import type { JobKey as RecoverPassMailJob } from '@modules/users/dtos/RecoverPassMailDTO';

export type Jobs = RegistrationMailJob & RecoverPassMailJob;

export type JobsKey = keyof Jobs;

export type JobData<T extends JobsKey> = Pick<Jobs, T>[T];

export default interface IQueueProvider {
  add<T extends JobsKey>(key: T, data: JobData<T>): Promise<void>;
  process(): Promise<void>;
}
