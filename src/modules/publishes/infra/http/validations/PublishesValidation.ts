import * as Yup from 'yup';
import FieldError from '@shared/errors/FieldError';

class PublishesValidation {
  public async create<T>(req: T): Promise<void> {
    const schema = Yup.object().shape({
      filename: Yup.string().required('Filename field is required'),
      text: Yup.string(),
      watermark: Yup.boolean(),
      to_world: Yup.boolean().required('to_world field is required'),
      direct_users: Yup.mixed().when('to_world', {
        is: false,
        then: Yup.array()
          .min(1, 'Empty array is not allowed')
          .required('Direct users field is required!'),
        otherwise: Yup.array(),
      }),
    });

    await schema.validate(req).catch(err => {
      const fieldWithError = err.path;
      const errorMessage = err.errors.shift();

      throw new FieldError(fieldWithError, errorMessage);
    });
  }

  public async delete<T>(req: T): Promise<void> {
    const schema = Yup.object().shape({
      publish_id: Yup.string().required('Publish ID is required'),
    });

    await schema.validate(req).catch(err => {
      const fieldWithError = err.path;
      const errorMessage = err.errors.shift();

      throw new FieldError(fieldWithError, errorMessage);
    });
  }
}

export default PublishesValidation;
