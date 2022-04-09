import * as Yup from 'yup';
import FieldError from '@shared/errors/FieldError';

class FollowersValidation {
  public async create<T>(req: T): Promise<void> {
    const schema = Yup.object().shape({
      user_follow: Yup.string().required('Param user_follow is required'),
    });

    await schema.validate(req).catch(err => {
      const fieldWithError = err.path;
      const errorMessage = err.errors.shift();

      throw new FieldError(fieldWithError, errorMessage);
    });
  }

  public async delete<T>(req: T): Promise<void> {
    const schema = Yup.object().shape({
      id: Yup.string().required('Param user_follow is required'),
    });

    await schema.validate(req).catch(err => {
      const fieldWithError = err.path;
      const errorMessage = err.errors.shift();

      throw new FieldError(fieldWithError, errorMessage);
    });
  }
}

export default FollowersValidation;
