import { inject, injectable } from 'tsyringe';

import { isBefore } from 'date-fns';

import AppError from '@shared/errors/AppError';

import IRefreshTokenRepository from '../repositories/IRefreshTokenRepository';
import IUsersRepository from '../repositories/IUsersRepository';
import ITokenProvider from '../providers/TokenProvider/models/ITokenProvider';

@injectable()
class RefreshTokenService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('RefreshTokenRepository')
    private refreshTokenRespository: IRefreshTokenRepository,

    @inject('TokenProvider')
    private tokenProvider: ITokenProvider,
  ) {}

  public async execute(
    refresh_token: string,
  ): Promise<{ token: string; refreshToken: string }> {
    const refreshToken = await this.refreshTokenRespository.findById(
      refresh_token,
    );

    if (!refreshToken) {
      throw new AppError('Refresh Token invalid!');
    }

    const user = await this.usersRepository.findById(
      String(refreshToken.user_id),
    );

    if (!user) {
      throw new AppError('User not found!');
    }

    const expiresInToMilliSeconds = refreshToken.expires_in * 1000;

    if (isBefore(expiresInToMilliSeconds, new Date())) {
      throw new AppError('Expired token!', 403);
    }

    const { token } = await this.tokenProvider.register({
      options: {
        subject: String(refreshToken.user_id),
      },
    });

    console.log(String(refreshToken.id));
    await this.refreshTokenRespository.deleteOne(String(refreshToken.id));

    const newRefreshToken = await this.refreshTokenRespository.create(
      String(refreshToken.user_id),
    );

    return {
      token,
      refreshToken: String(newRefreshToken.id),
    };
  }
}

export default RefreshTokenService;
