import { ObjectId } from 'bson';
import { v4 as uuid } from 'uuid';

import RefreshToken from '@modules/users/infra/typeorm/schemas/RefreshToken';
import IRefreshTokenRepository from '../IRefreshTokenRepository';

class FakeRefreshTokenRepository implements IRefreshTokenRepository {
  private tokens: RefreshToken[] = [];

  public async create(user_id: string): Promise<RefreshToken> {
    const token = new RefreshToken();

    Object.assign(token, {
      id: uuid(),
      user_id: new ObjectId(user_id),
    });

    this.tokens.push(token);

    return token;
  }

  public async deleteOne(id: string): Promise<void> {
    const tokenIndex = this.tokens.findIndex(token => String(token.id) === id);

    if (tokenIndex !== -1) {
      this.tokens.splice(tokenIndex, 1);
    }
  }

  public async deleteByUserId(user_id: string): Promise<void> {
    const tokenIndex = this.tokens.findIndex(
      token => String(token.user_id) === user_id,
    );

    if (tokenIndex !== -1) {
      this.tokens.splice(tokenIndex, 1);
    }
  }

  public async findById(id: string): Promise<RefreshToken> {
    const token = this.tokens.find(t => String(t.id) === id);

    return token;
  }

  public async findByUserId(user_id: string): Promise<RefreshToken> {
    const token = this.tokens.find(t => String(t.user_id) === user_id);

    return token;
  }
}

export default FakeRefreshTokenRepository;
