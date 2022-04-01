import { container } from 'tsyringe';

import RegistrationMailJob from '@modules/users/infra/jobs/RegistrationMailJob';
import RecoverPassMailJob from '@modules/users/infra/jobs/RecoverPassMailJob';

const jobs = [
  container.resolve(RegistrationMailJob),
  container.resolve(RecoverPassMailJob),
];

export default jobs;
