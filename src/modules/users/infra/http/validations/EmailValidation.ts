import * as Yup from 'yup';
import FieldError from '@shared/errors/FieldError';

class EmailValidation {
  public async update<T>(req: T): Promise<void> {
    const schema = Yup.object().shape({
      email: Yup.string().email().required('Email is required'),
      code: Yup.number().required('Code is required'),
    });

    await schema.validate(req).catch(err => {
      const fieldWithError = err.path;
      const errorMessage = err.errors.shift();

      throw new FieldError(fieldWithError, errorMessage);
    });
  }
}

export default EmailValidation;
