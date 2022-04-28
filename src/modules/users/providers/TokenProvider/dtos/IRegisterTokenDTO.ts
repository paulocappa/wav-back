type RegisterTokenOptions = {
  subject: string;
  expiresIn?: string | number;
};

export default interface IRegisterTokenDTO {
  payload?: string | object | Buffer;
  options: RegisterTokenOptions;
}
