import RefreshToken from '../infra/typeorm/schemas/RefreshToken';

export default interface IRefreshTokenRepository {
  create(user_id: string): Promise<RefreshToken>;
  findById(id: string): Promise<RefreshToken | null>;
  findByUserId(user_id: string): Promise<RefreshToken | null>;
  deleteOne(id: string): Promise<void>;
  deleteByUserId(user_id: string): Promise<void>;
}
