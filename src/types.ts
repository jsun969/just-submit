export type FieldStrTypeMap = {
  string: string;
  number: number;
  date: Date;
  boolean: boolean;
};
export type FieldStrType = keyof FieldStrTypeMap;
export type Field = FieldStrTypeMap[FieldStrType];

export type FormValues = Record<string, Field>;
export type FormValuesStrTypes = Record<string, FieldStrType>;
export type GetFormValuesFromStrTypes<
  TFormValuesStrTypes extends FormValuesStrTypes,
> = {
  [PField in keyof TFormValuesStrTypes]: FieldStrTypeMap[TFormValuesStrTypes[PField]];
};

export type FormEvent = {
  preventDefault: () => void;
  currentTarget: unknown;
};
export type SubmitFn<TFormValues extends FormValues> = (
  data: TFormValues,
) => void | Promise<void>;
