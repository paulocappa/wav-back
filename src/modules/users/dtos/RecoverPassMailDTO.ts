export const keyName = 'RecoverPassMail';

export type JobKey = {
  [keyName]: IRecoverPassMailDTO;
};

export default interface IRecoverPassMailDTO {
  user: {
    name: string;
    email: string;
    token: string;
  };
}
