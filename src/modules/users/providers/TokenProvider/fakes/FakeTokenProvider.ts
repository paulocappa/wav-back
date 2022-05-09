import { v4 as uuid } from 'uuid';

import IRegisterTokenDTO from '../dtos/IRegisterTokenDTO';
import ITokenProvider from '../models/ITokenProvider';

class FakeTokenProvider implements ITokenProvider {
  private userToken: string;

  public async verify(token: string): Promise<string> {
    if (token !== this.userToken) {
      throw new Error();
    }

    return token;
  }

  public async register(data: IRegisterTokenDTO): Promise<{ token: string }> {
    const token = uuid();

    this.userToken = token;

    return { token };
  }
}

export default FakeTokenProvider;
