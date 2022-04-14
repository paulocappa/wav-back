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

const formatNumber = (field: string, number: 1e6 | 1e3) => {
  const letters = [
    { value: 1e6, letter: 'M' },
    { value: 1e3, letter: 'k' },
  ];

  return {
    $concat: [
      {
        $toString: {
          $round: [
            {
              $divide: [`$${field}`, number],
            },
            {
              $cond: [
                {
                  $gte: [
                    {
                      $divide: [`$${field}`, number],
                    },
                    100,
                  ],
                },
                0,
                1,
              ],
            },
          ],
        },
      },
      letters.find(l => l.value === number).letter,
    ],
  };
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
      case 'count_followers':
      case 'count_following':
        project[`formatted_${field}`] = {
          $switch: {
            branches: [
              {
                case: {
                  $gte: [`$${field}`, 1e6],
                },
                then: formatNumber(field, 1e6),
              },
              {
                case: {
                  $gte: [`$${field}`, 1e3],
                },
                then: formatNumber(field, 1e3),
              },
            ],
            default: {
              $toString: `$${field}`,
            },
          },
        };
        break;
      default:
        project[field] = 1;
    }
  });

  return project;
}
