import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import User from '@modules/users/infra/typeorm/schemas/User';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import ITokenProvider from '../providers/TokenProvider/models/ITokenProvider';
import IRefreshTokenRepository from '../repositories/IRefreshTokenRepository';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  tokens: {
    token: string;
    refreshToken: string;
  };
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('RefreshTokenRepository')
    private refreshTokenRepository: IRefreshTokenRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,

    @inject('TokenProvider')
    private tokenProvider: ITokenProvider,
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Incorret email/password combination', 401);
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatched) {
      throw new AppError('Incorret email/password combination', 401);
    }

    const { token } = await this.tokenProvider.register({
      options: {
        subject: String(user.id),
      },
    });

    await this.refreshTokenRepository.deleteByUserId(String(user.id));

    const refreshToken = await this.refreshTokenRepository.create(
      String(user.id),
    );

    await this.cacheProvider.save(`user-info:${user.id}`, user);

    return {
      user,
      tokens: {
        token,
        refreshToken: String(refreshToken.id),
      },
    };
  }
}

export default AuthenticateUserService;
