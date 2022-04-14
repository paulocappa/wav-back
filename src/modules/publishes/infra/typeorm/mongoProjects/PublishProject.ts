/* eslint-disable @typescript-eslint/no-explicit-any */

import uploadConfig from '@config/upload';
import Publish from '../schemas/Publish';

type FieldType = Array<keyof Publish>;

const getPublishBaseUrl = (): string | null => {
  switch (uploadConfig.driver) {
    case 'disk':
      return `${process.env.API_URL}/file`;
    case 's3':
      return uploadConfig.config.s3.url;
    default:
      return null;
  }
};

export default function publishProject(fields: FieldType) {
  const project = {
    _id: 0,
    id: {
      $toString: '$_id',
    },
  } as any;

  fields.forEach(field => {
    switch (field) {
      case 'user_id':
        project[field] = {
          $toString: `$${field}`,
        };
        break;
      case 'file':
        project[field] = 1;
        project.publish_url = {
          $concat: [`${getPublishBaseUrl()}/`, `$${field}`],
        };
        break;
      default:
        project[field] = 1;
    }
  });

  return project;
}
