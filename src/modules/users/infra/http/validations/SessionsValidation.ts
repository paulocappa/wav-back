import * as Yup from 'yup';
import FieldError from '@shared/errors/FieldError';

class SessionsValidation {
  public async create<T>(body: T): Promise<void> {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email('Email provided is not a valid email')
        .required('Email is required'),
      password: Yup.string().required('Password is required'),
    });

    await schema.validate(body).catch(err => {
      const fieldWithError = err.path;
      const errorMessage = err.errors.shift();

      throw new FieldError(fieldWithError, errorMessage);
    });
  }
}

export default SessionsValidation;
