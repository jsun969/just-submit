import type { MockInstance } from 'vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { factory } from '../src/factory';
import type {
  FormValuesStrTypes,
  GetFormValuesFromStrTypes,
} from '../src/types';

const mockFormDataObj = {
  string: 'text',
  number: '6',
  date: '2023-12-24',
  boolean: 'on',
};
const mockFormValuesTypes = {
  string: 'string',
  number: 'number',
  date: 'date',
  boolean: 'boolean',
} satisfies FormValuesStrTypes;
const mockFormResult: GetFormValuesFromStrTypes<typeof mockFormValuesTypes> = {
  string: 'text',
  number: 6,
  date: new Date('2023-12-24'),
  boolean: true,
};

const objectToFormData = (obj: Record<string, string>) => {
  const formData = new FormData();
  for (const [name, value] of Object.entries(obj)) {
    formData.append(name, value);
  }
  return formData;
};

describe('factory', () => {
  const dataCallback = vi.fn();
  const event = vi.fn();
  let errorSpy: MockInstance<unknown[], void>;

  beforeEach(() => {
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should convert form data to correct object', () => {
    const createSubmit = factory<typeof event>(() =>
      objectToFormData(mockFormDataObj),
    );
    const submit = createSubmit(mockFormValuesTypes);
    submit(dataCallback)(event);

    expect(errorSpy).not.toHaveBeenCalled();
    expect(dataCallback).toHaveBeenCalledOnce();
    expect(dataCallback).toHaveBeenCalledWith(mockFormResult, event);
  });

  it('should convert boolean field to false when it is missing in form data', () => {
    const createSubmit = factory<typeof event>(() => {
      const { boolean, ...formDataMissingBoolean } = mockFormDataObj;
      return objectToFormData(formDataMissingBoolean);
    });
    const submit = createSubmit(mockFormValuesTypes);
    submit(dataCallback)(event);

    expect(errorSpy).not.toHaveBeenCalled();
    expect(dataCallback).toHaveBeenCalledOnce();
    expect(dataCallback).toHaveBeenCalledWith(
      { ...mockFormResult, boolean: false },
      event,
    );
  });

  it('should show error when form data field is not string (null)', () => {
    const createSubmit = factory<typeof event>(() => {
      const { string, ...formDataMissingValue } = mockFormDataObj;
      return objectToFormData(formDataMissingValue);
    });
    const submit = createSubmit(mockFormValuesTypes);
    submit(dataCallback)(event);

    expect(errorSpy).toHaveBeenCalledOnce();
    expect(errorSpy).toHaveBeenCalledWith(
      '[Form Field Converting Error]\nName: string\nValue: null\nTarget Type: string',
    );
    expect(dataCallback).toHaveBeenCalledOnce();
    expect(dataCallback).toHaveBeenCalledWith(
      { ...mockFormResult, string: '' },
      event,
    );
  });

  it('should show error when number cannot be converted', () => {
    const createSubmit = factory<typeof event>(() =>
      objectToFormData({ ...mockFormDataObj, number: 'bad-number' }),
    );
    const submit = createSubmit(mockFormValuesTypes);
    submit(dataCallback)(event);

    expect(errorSpy).toHaveBeenCalledOnce();
    expect(errorSpy).toHaveBeenCalledWith(
      '[Form Field Converting Error]\nName: number\nValue: bad-number\nTarget Type: number',
    );
    expect(dataCallback).toHaveBeenCalledOnce();
    expect(dataCallback).toHaveBeenCalledWith(
      { ...mockFormResult, number: -1 },
      event,
    );
  });

  it('should show error when date cannot be converted', () => {
    const createSubmit = factory<typeof event>(() =>
      objectToFormData({ ...mockFormDataObj, date: 'bad-date' }),
    );
    const submit = createSubmit(mockFormValuesTypes);
    submit(dataCallback)(event);

    expect(errorSpy).toHaveBeenCalledOnce();
    expect(errorSpy).toHaveBeenCalledWith(
      '[Form Field Converting Error]\nName: date\nValue: bad-date\nTarget Type: date',
    );
    expect(dataCallback).toHaveBeenCalledOnce();
    expect(dataCallback).toHaveBeenCalledWith(
      { ...mockFormResult, date: new Date('2005-03-12') },
      event,
    );
  });
});