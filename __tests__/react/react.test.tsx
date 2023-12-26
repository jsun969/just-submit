import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { createSubmit } from '../../src/react';
import { mockFormDataObj, mockFormResult, mockFormValuesTypes } from '../mock';

describe('react', () => {
  const dataCallback = vi.fn();

  it('should get correct form data', async () => {
    const handleSubmit = createSubmit(mockFormValuesTypes);
    render(
      <form onSubmit={handleSubmit(dataCallback)}>
        <input type="text" name="string" data-testid="string" />
        <input type="number" name="number" data-testid="number" />
        <input type="checkbox" name="boolean" data-testid="boolean" />
        <input type="date" name="date" data-testid="date" />
        <button type="submit">SUBMIT</button>
      </form>,
    );

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
    expect(dataCallback).toHaveBeenCalledWith(
      mockFormResult,
      expect.anything(), // Form event
    );
  });
});
