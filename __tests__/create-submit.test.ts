import { createSubmit } from '../src/create-submit';
import { mockFormDataObj, mockFormResult, mockFormValuesTypes } from './mock';

const formDataToCurrentTarget = (formData: Record<string, string>) => {
  const inputs = Object.entries(formData).reduce((acc, [name, value]) => {
    acc += `<input type="text" name="${name}" value="${value}" />`;
    return acc;
  }, '');
  document.body.innerHTML = `<form>${inputs}</form>`;
  const form = document.querySelector('form') as HTMLFormElement;
  return form;
};

describe('factory', () => {
  const dataCallback = vi.fn();
  const preventDefault = vi.fn();

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should convert form data to correct object', () => {
    const event = {
      preventDefault,
      currentTarget: formDataToCurrentTarget(mockFormDataObj),
    };
    const submit = createSubmit(mockFormValuesTypes);
    submit(dataCallback)(event);

    expect(dataCallback).toHaveBeenCalledOnce();
    expect(dataCallback).toHaveBeenCalledWith(mockFormResult);
  });

  it('should convert boolean field to false when it is missing in form data', () => {
    const { boolean, ...formDataMissingBoolean } = mockFormDataObj;
    const event = {
      preventDefault,
      currentTarget: formDataToCurrentTarget(formDataMissingBoolean),
    };
    const submit = createSubmit(mockFormValuesTypes);
    submit(dataCallback)(event);

    expect(dataCallback).toHaveBeenCalledOnce();
    expect(dataCallback).toHaveBeenCalledWith({
      ...mockFormResult,
      boolean: false,
    });
  });

  it('should show error when form data field is not string (null)', () => {
    const { string, ...formDataMissingValue } = mockFormDataObj;
    const event = {
      preventDefault,
      currentTarget: formDataToCurrentTarget(formDataMissingValue),
    };
    const submit = createSubmit(mockFormValuesTypes);

    expect(() => submit(dataCallback)(event)).rejects.toThrowError(
      '[Form Field Converting Error]\nName: string\nValue: null\nTarget Type: string',
    );
    expect(dataCallback).not.toHaveBeenCalled();
  });

  it('should show error when number cannot be converted', () => {
    const event = {
      preventDefault,
      currentTarget: formDataToCurrentTarget({
        ...mockFormDataObj,
        number: 'bad-number',
      }),
    };
    const submit = createSubmit(mockFormValuesTypes);

    expect(() => submit(dataCallback)(event)).rejects.toThrowError(
      '[Form Field Converting Error]\nName: number\nValue: bad-number\nTarget Type: number',
    );
    expect(dataCallback).not.toHaveBeenCalled();
  });

  it('should show error when date cannot be converted', () => {
    const event = {
      preventDefault,
      currentTarget: formDataToCurrentTarget({
        ...mockFormDataObj,
        date: 'bad-date',
      }),
    };
    const submit = createSubmit(mockFormValuesTypes);

    expect(() => submit(dataCallback)(event)).rejects.toThrowError(
      '[Form Field Converting Error]\nName: date\nValue: bad-date\nTarget Type: date',
    );
    expect(dataCallback).not.toHaveBeenCalled();
  });
});
