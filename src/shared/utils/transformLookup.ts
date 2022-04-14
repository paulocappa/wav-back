/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserExposeFieldsName } from '@modules/users/infra/typeorm/schemas/User';
import { PublishExposeFieldsName } from '@modules/publishes/infra/typeorm/schemas/Publish';

type ExposeFields =
  | typeof UserExposeFieldsName
  | typeof PublishExposeFieldsName;

interface ITransformLookup {
  value: any;
  obj: any;
  key: string;
  expose_fields: ExposeFields;
}

export default function transformLookup({
  value,
  obj,
  key,
  expose_fields,
}: ITransformLookup) {
  const lookupObject = obj[key];

  const dataKeys = Object.keys(lookupObject);

  expose_fields.forEach(({ field, reference }) => {
    if (reference in lookupObject) {
      dataKeys.push(field);
    }
  });

  const object = {} as Record<string, unknown>;

  dataKeys.forEach((k: string) => {
    object[k] = value[k];
  });

  return object;
}
