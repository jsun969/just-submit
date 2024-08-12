import type {
  FieldStrType,
  FieldStrTypeMap,
  FormEvent,
  FormValues,
  FormValuesStrTypes,
  GetFormValuesFromStrTypes,
  SubmitFn,
} from './types';

type ConvertFieldFns = {
  [PType in FieldStrType]: (value: string) => FieldStrTypeMap[PType];
};

/**
 * Creates a submission handler for a form with specified field types.
 * This function streamlines the process of handling form submissions by
 * automatically validating and parsing form data according to the provided
 * field type specifications.
 *
 * @param formValuesType - An object that maps each form field's name to its expected data type.
 *                         Supported data types are `string`, `number`, `date`, and `boolean`.
 *                         This mapping is used to parse the form data from string.
 *
 * @returns A function that can be used as an event handler for form submission.
 *          This handler takes a callback function as an argument, which will be
 *          called with the parsed form data if the validation is successful.
 *          The form data is passed as an object with key-value pairs corresponding
 *          to form field names and their parsed values.
 *
 * @example
 * const handleSubmit = createSubmit({
 *   fullName: 'string',
 *   age: 'number',
 *   birthday: 'date',
 *   wantGift: 'boolean',
 * });
 * const form = document.querySelector('form');
 * form.addEventListener(
 *   'submit',
 *   handleSubmit((data) => {
 *     // ...
 *   }),
 * );
 */
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
          throw new Error(errorMessage);
        }
        const convertFieldFns: ConvertFieldFns = {
          string: (value) => value,
          boolean: () => true,
          number: (value) => {
            const res = Number(value);
            if (isNaN(res)) {
              throw new Error(errorMessage);
            }
            return res;
          },
          date: (value) => {
            const res = new Date(value);
            if (isNaN(res.getTime())) {
              throw new Error(errorMessage);
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
