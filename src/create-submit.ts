import type {
  FieldStrType,
  FieldStrTypeMap,
  FormEvent,
  FormValues,
  FormValuesStrTypes,
  GetFormValuesFromStrTypes,
  SubmitFn,
} from './types';

const DEFAULT_VALUE_WHEN_ERROR: FieldStrTypeMap = {
  string: '',
  number: -1,
  boolean: false,
  date: new Date('2005-03-12'),
};

type ConvertFieldFns = {
  [PType in FieldStrType]: (value: string) => FieldStrTypeMap[PType];
};

export const createSubmit = <
  TFormValuesStrTypes extends FormValuesStrTypes,
  TFormValues extends
    FormValues = GetFormValuesFromStrTypes<TFormValuesStrTypes>,
  TFormEvent extends FormEvent = FormEvent,
>(
  formValuesType: TFormValuesStrTypes,
) => {
  const handleSubmit =
    (submitFn: SubmitFn<TFormValues>) => async (formEvent: TFormEvent) => {
      formEvent.preventDefault();
      const formData = new FormData(formEvent.currentTarget as HTMLFormElement);
      const formValues = {} as FormValues;
      for (const [name, type] of Object.entries(formValuesType)) {
        const valueInFormData = formData.get(name);
        // Form data value can be null when checkbox (or any other boolean input) is not checked
        if (type === 'boolean' && valueInFormData === null) {
          formValues[name] = false;
          continue;
        }
        const errorMessage = `[Form Field Converting Error]\nName: ${name}\nValue: ${valueInFormData}\nTarget Type: ${type}\n\nSee: https://github.com/jsun969/just-submit#form-field-converting-error`;
        if (typeof valueInFormData !== 'string') {
          console.error(errorMessage);
          formValues[name] = DEFAULT_VALUE_WHEN_ERROR[type];
          continue;
        }
        const convertFieldFns: ConvertFieldFns = {
          string: (value) => value,
          boolean: () => true,
          number: (value) => {
            const res = Number(value);
            if (isNaN(res)) {
              console.error(errorMessage);
              return DEFAULT_VALUE_WHEN_ERROR['number'];
            }
            return res;
          },
          date: (value) => {
            const res = new Date(value);
            if (isNaN(res.getTime())) {
              console.error(errorMessage);
              return DEFAULT_VALUE_WHEN_ERROR['date'];
            }
            return res;
          },
        };
        formValues[name] = convertFieldFns[type](valueInFormData);
      }
      await submitFn(formValues as TFormValues);
    };
  return handleSubmit;
};