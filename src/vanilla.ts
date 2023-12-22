import { factory } from './factory';

export const createSubmit = factory<SubmitEvent>((e) => {
  e.preventDefault();
  const formData = new FormData(e.target as HTMLFormElement);
  return formData;
});
