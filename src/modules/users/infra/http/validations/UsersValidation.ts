import * as yup from 'yup';

import FieldError from '@shared/errors/FieldError';

class UsersValidation {
  public async create<T>(body: T): Promise<void> {
    const schema = yup.object().shape({
      name: yup
        .string()
        .required('Name is required')
        .typeError('Name field must be a string value'),
      username: yup
        .string()
        .required('Username is required')
        .min(4, 'Username is too short')
        .max(25, 'Username is too long')
        .typeError('Username field must be a string value'),
      email: yup
        .string()
        .required('Email is required')
        .email('Field email is not an email')
        .typeError('Email field must be a string value'),
      password: yup
        .string()
        .required('Password is required')
        .min(6, 'Password very weak')
        .typeError('Password field must be a string value'),
    });

    await schema.validate(body).catch(err => {
      const fieldWithError = err.path;
      const errorMessage = err.errors.shift();

      throw new FieldError(fieldWithError, errorMessage);
    });
  }

  public async update<T>(body: T): Promise<void> {
    const schema = yup.object().shape({
      name: yup
        .string()
        .required('Name is required')
        .typeError('Name field must be a string value'),
      username: yup
        .string()
        .required('Username is required')
        .min(4, 'Username is too short')
        .max(25, 'Username is too long')
        .typeError('Username field must be a string value'),
      email: yup
        .string()
        .required('Email is required')
        .email('Field email is not an email')
        .typeError('Email field must be a string value'),
      old_password: yup
        .string()
        .typeError('Old password field must be a string value'),
      new_password: yup.string().when('old_password', {
        is: (oldPassword: string) => !!oldPassword,
        then: yup
          .string()
          .required('New password is required')
          .min(6, 'New password is very weak'),
      }),
      confirm_password: yup.string().when('new_password', {
        is: (newPassword: string) => !!newPassword,
        then: yup
          .string()
          .oneOf([yup.ref('new_password')], 'Password does not match')
          .required('Confirm password is required'),
      }),
    });

    await schema.validate(body).catch(err => {
      const fieldWithError = err.path;
      const errorMessage = err.errors.pop();

      throw new FieldError(fieldWithError, errorMessage);
    });
  }
}

export default UsersValidation;
