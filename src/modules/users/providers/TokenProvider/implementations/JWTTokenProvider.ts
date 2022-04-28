import { sign, verify as JWTVerify } from 'jsonwebtoken';

import authConfig from '@config/auth';

import IRegisterTokenDTO from '../dtos/IRegisterTokenDTO';
import ITokenProvider from '../models/ITokenProvider';

class JWTTokenProvider implements ITokenProvider {
  public async verify(token: string): Promise<string> {
    const { secret } = authConfig.jwt;

    const decoded = JWTVerify(token, secret);

    if (!decoded.sub) {
      throw new Error();
    }

    return decoded.sub as string;
  }

  public async register({
    payload = {},
    options,
  }: IRegisterTokenDTO): Promise<{ token: string }> {
    const { secret, expiresIn } = authConfig.jwt;

    const token = sign(payload, secret, {
      expiresIn,
      ...options,
    });

    return { token };
  }
}

export default JWTTokenProvider;
