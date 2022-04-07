import { ObjectId } from 'bson';
import { inject } from 'tsyringe';
import IUsersRepository from '../repositories/IUsersRepository';

class IncrementFollowingCountService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(user_id: string): Promise<void> {
    const ormRepository = this.usersRepository.userOrmRepository;

    await ormRepository.updateOne(
      {
        _id: new ObjectId(user_id),
      },
      {
        $inc: {
          count_following: 1,
        },
      },
    );
  }
}

export default IncrementFollowingCountService;
