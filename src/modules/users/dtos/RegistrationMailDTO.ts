export const keyName = 'RegistrationMail';

export type JobKey = {
  [keyName]: IRegistrationMailDTO;
};

export default interface IRegistrationMailDTO {
  user: {
    name: string;
    email: string;
    code: number;
  };
}
