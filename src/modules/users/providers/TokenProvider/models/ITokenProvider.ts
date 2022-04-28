import IRegisterTokenDTO from '../dtos/IRegisterTokenDTO';

export default interface ITokenProvider {
  verify(token: string): Promise<string>;
  register(data: IRegisterTokenDTO): Promise<{ token: string }>;
}
