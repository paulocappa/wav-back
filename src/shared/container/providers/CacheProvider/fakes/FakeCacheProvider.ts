import IRecoverFromList from '../dtos/IRecoverFromList';
import ICacheProvider from '../models/ICacheProvider';

interface ICacheData {
  [key: string]: string | unknown[];
}

class FakeCacheProvider implements ICacheProvider {
  private cache: ICacheData = {};

  public async save<T>(key: string, value: T): Promise<void> {
    this.cache[key] = JSON.stringify(value);
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = this.cache[key] as string;

    if (!data) return null;

    return JSON.parse(data) as T;
  }

  public async invalidate(key: string): Promise<void> {
    delete this.cache[key];
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    const keys = Object.keys(this.cache).filter(key =>
      key.startsWith(`${prefix}:`),
    );

    keys.forEach(key => {
      delete this.cache[key];
    });
  }

  public async invalidateMany(keys: string[]): Promise<void> {
    keys.forEach(key => {
      delete this.cache[key];
    });
  }

  public async pushToList<T>(key: string, value: T[]): Promise<void> {
    this.cache[key] = value;
  }

  public async recoverFromList<T>({ key }: IRecoverFromList): Promise<T[]> {
    const findKey = this.cache[key] as T[];

    return findKey;
  }
}

export default FakeCacheProvider;
