import type React from 'react';

import { factory } from './factory';

export const createSubmit = factory<React.FormEvent<HTMLFormElement>>((e) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  return formData;
});
