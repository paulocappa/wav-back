import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

@injectable()
class CheckUserIsAdministrator {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(user_id: string): Promise<boolean> {
    const user = await this.usersRepository.findById(user_id);

    return user.administrator;
  }
}

export default CheckUserIsAdministrator;
