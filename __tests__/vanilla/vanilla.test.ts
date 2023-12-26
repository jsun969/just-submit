import { fireEvent, screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { createSubmit } from '../../src/vanilla';
import { mockFormDataObj, mockFormResult, mockFormValuesTypes } from '../mock';

describe('vanilla', () => {
  const dataCallback = vi.fn();

  it('should get correct form data', async () => {
    const handleSubmit = createSubmit(mockFormValuesTypes);
    document.body.innerHTML = `
      <form>
        <input type="text" name="string" data-testid="string" />
        <input type="number" name="number" data-testid="number" />
        <input type="checkbox" name="boolean" data-testid="boolean" />
        <input type="date" name="date" data-testid="date" />
        <button type="submit">SUBMIT</button>
      </form>
    `;
    const form = document.querySelector('form') as HTMLFormElement;
    form.addEventListener('submit', handleSubmit(dataCallback));

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
