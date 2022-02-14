import * as Yup from 'yup';

import FieldError from '@shared/errors/FieldError';

class ResetPasswordValidation {
  public async create<T>(body: T): Promise<void> {
    const schema = Yup.object().shape({
      token: Yup.string()
        .uuid('Token type not valid')
        .required('Token is required'),
      password: Yup.string()
        .required('Password is required')
        .min(6, 'Password is very weak'),
      confirm_password: Yup.string()
        .oneOf([Yup.ref('password')], 'Password does not match')
        .required('Confirm password is required'),
    });

    await schema.validate(body).catch(err => {
      const fieldWithError = err.path;
      const errorMessage = err.errors.shift();

      throw new FieldError(fieldWithError, errorMessage);
    });
  }
}

export default ResetPasswordValidation;
