import * as Yup from 'yup';
import FieldError from '@shared/errors/FieldError';

class AvatarValidation {
  public async update<T>(req: T): Promise<void> {
    const schema = Yup.object().shape({
      user_id: Yup.string().required('Param user_id is required'),
      file: Yup.mixed().required('File is required'),
    });

    await schema.validate(req).catch(err => {
      const fieldWithError = err.path;
      const errorMessage = err.errors.shift();

      throw new FieldError(fieldWithError, errorMessage);
    });
  }
}

export default AvatarValidation;
