import userEvent from '@testing-library/user-event';
import { fireEvent, render, screen } from '@testing-library/vue';

import { createSubmit } from '../../src/create-submit';
import { mockFormDataObj, mockFormResult, mockFormValuesTypes } from '../mock';
import Form from './Form.vue';

describe('vue', () => {
  const dataCallback = vi.fn();

  it('should get correct form data', async () => {
    const handleSubmit = createSubmit(mockFormValuesTypes)(dataCallback);
    render(Form, { props: { onSubmit: handleSubmit } });

    await userEvent.type(
      screen.getByTestId('string'),
      mockFormDataObj['string'],
    );
    await userEvent.type(
      screen.getByTestId('number'),
      mockFormDataObj['number'],
    );
    await userEvent.click(screen.getByTestId('boolean'));
    fireEvent.update(screen.getByTestId('date'), mockFormDataObj['date']);
    await userEvent.click(screen.getByText('SUBMIT'));

    expect(dataCallback).toHaveBeenCalledOnce();
    expect(dataCallback).toHaveBeenCalledWith(mockFormResult);
  });
});
