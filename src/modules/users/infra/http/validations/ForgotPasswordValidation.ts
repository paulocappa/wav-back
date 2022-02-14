import * as Yup from 'yup';

import FieldError from '@shared/errors/FieldError';

class ForgotPasswordValidation {
  public async create<T>(body: T): Promise<void> {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email('Email is not a valid email')
        .required('Email is required'),
    });

    await schema.validate(body).catch(err => {
      const fieldWithError = err.path;
      const errorMessage = err.errors.shift();

      throw new FieldError(fieldWithError, errorMessage);
    });
  }
}

export default ForgotPasswordValidation;
