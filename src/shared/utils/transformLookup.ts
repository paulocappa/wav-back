/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserExposeFieldsName } from '@modules/users/infra/typeorm/schemas/User';

type ExposeFields = typeof UserExposeFieldsName;

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
  const data = obj[key];

  const dataKeys = Object.keys(data);

  expose_fields.forEach(({ field, reference }) => {
    if (reference in data) {
      dataKeys.push(field);
    }
  });

  const object = {} as Record<string, unknown>;

  dataKeys.forEach((k: string) => {
    object[k] = value[k];
  });

  return object;
}
