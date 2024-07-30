import { TransformFnParams } from 'class-transformer';
import { DateTime } from 'luxon';

export const dateParser = ({ value }: TransformFnParams): any => {
  if (!value) return 0;

  if (value.toString().length < 24) return 0;

  const dt = DateTime.fromISO(value);

  if (!dt.isValid) return 0;

  return value;
};
