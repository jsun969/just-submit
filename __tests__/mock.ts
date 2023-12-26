import type {
  FormValuesStrTypes,
  GetFormValuesFromStrTypes,
} from '../src/types';

export const mockFormDataObj = {
  string: 'text',
  number: '6',
  date: '2023-12-24',
  boolean: 'on',
};
export const mockFormValuesTypes = {
  string: 'string',
  number: 'number',
  date: 'date',
  boolean: 'boolean',
} satisfies FormValuesStrTypes;
export const mockFormResult: GetFormValuesFromStrTypes<
  typeof mockFormValuesTypes
> = {
  string: 'text',
  number: 6,
  date: new Date('2023-12-24'),
  boolean: true,
};
