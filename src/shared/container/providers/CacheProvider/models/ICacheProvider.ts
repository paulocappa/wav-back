import IRecoverFromList from '../dtos/IRecoverFromList';

export default interface ICacheProvider {
  save<T>(key: string, value: T): Promise<void>;
  recover<T>(key: string): Promise<T | null>;
  invalidate(key: string): Promise<void>;
  invalidatePrefix(prefix: string): Promise<void>;
  invalidateMany(keys: string[]): Promise<void>;
  pushToList<T>(key: string, value: T[]): Promise<void>;
  recoverFromList<T>(data: IRecoverFromList): Promise<T[] | null>;
}
