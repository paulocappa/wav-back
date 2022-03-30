import multer, { StorageEngine } from 'multer';
import crypto from 'crypto';
import path from 'path';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

interface IUploadConfig {
  driver: 's3' | 'disk';

  tmpFolder: string;
  uploadsFolder: string;

  multer: {
    storage: StorageEngine;
  };

  config: {
    disk: Record<string, unknown>;
    s3: {
      bucket: string;
      url: string;
    };
  };
}

export default {
  driver: process.env.STORAGE_DRIVER || 'disk',

  tmpFolder,
  uploadsFolder: path.resolve(tmpFolder, 'uploads'),

  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename(_, file, cb) {
        const fileHash = crypto.randomBytes(16).toString('hex');
        const filename = `${fileHash}-${file.originalname}`;

        return cb(null, filename);
      },
    }),
  },

  config: {
    disk: {},
    s3: {
      bucket: process.env.AWS_BUCKET_NAME || 'bucket-aws',
      url: `https://${
        process.env.AWS_BUCKET_NAME || 'bucket-aws'
      }.s3.amazonaws.com`,
    },
  },
} as IUploadConfig;
