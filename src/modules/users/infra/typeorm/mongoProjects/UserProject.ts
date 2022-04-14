/* eslint-disable @typescript-eslint/no-explicit-any */
import User from '@modules/users/infra/typeorm/schemas/User';

import uploadConfig from '@config/upload';

type FieldType = Array<keyof User>;

const getAvatarBaseUrl = (): string | null => {
  switch (uploadConfig.driver) {
    case 'disk':
      return `${process.env.API_URL}/file`;
    case 's3':
      return uploadConfig.config.s3.url;
    default:
      return null;
  }
};

export default function userProject(fields: FieldType) {
  const project = {
    _id: 0,
    id: {
      $toString: '$_id',
    },
  } as any;

  fields.forEach(field => {
    switch (field) {
      case 'username':
        project[field] = {
          $concat: ['@', `$${field}`],
        };
        break;
      case 'avatar':
        project[field] = 1;
        project.avatar_url = {
          $concat: [`${getAvatarBaseUrl()}/`, `$${field}`],
        };
        break;
      default:
        project[field] = 1;
    }
  });

  return project;
}
