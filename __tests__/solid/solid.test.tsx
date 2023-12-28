/** @jsxImportSource solid-js */
import { fireEvent, render, screen } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';

import { createSubmit } from '../../src/create-submit';
import { mockFormDataObj, mockFormResult, mockFormValuesTypes } from '../mock';

describe('solid', () => {
  const dataCallback = vi.fn();

  it('should get correct form data', async () => {
    const handleSubmit = createSubmit(mockFormValuesTypes);
    const Form = () => (
      <form onSubmit={handleSubmit(dataCallback)}>
        <input type="text" name="string" data-testid="string" />
        <input type="number" name="number" data-testid="number" />
        <input type="checkbox" name="boolean" data-testid="boolean" />
        <input type="date" name="date" data-testid="date" />
        <button type="submit">SUBMIT</button>
      </form>
    );
    render(() => <Form />);

    await userEvent.type(
      screen.getByTestId('string'),
      mockFormDataObj['string'],
    );
    await userEvent.type(
      screen.getByTestId('number'),
      mockFormDataObj['number'],
    );
    await userEvent.click(screen.getByTestId('boolean'));
    fireEvent.change(screen.getByTestId('date'), {
      target: { value: mockFormDataObj['date'] },
    });
    await userEvent.click(screen.getByText('SUBMIT'));

    expect(dataCallback).toHaveBeenCalledOnce();
    expect(dataCallback).toHaveBeenCalledWith(mockFormResult);
  });
});
