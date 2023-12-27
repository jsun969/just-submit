<div align="center">

# 🛫 Just Submit

Submit simple form, with safe types, without management!

[![version](https://img.shields.io/npm/v/just-submit?style=for-the-badge)](https://www.npmjs.com/package/just-submit)
[![license](https://img.shields.io/npm/l/just-submit?style=for-the-badge)](https://github.com/jsun969/just-submit/blob/dev/LICENSE)
[![size](https://img.shields.io/bundlephobia/minzip/just-submit?style=for-the-badge)](https://bundlephobia.com/result?p=just-submit)
[![downloads](https://img.shields.io/npm/dw/just-submit?style=for-the-badge)](https://www.npmjs.com/package/just-submit)

</div>

## ✨ Features

- 🔒 TYPE SAFE
- ⚡ Speedy DX
- 🧪 Well-Tested
- 🍃 Ultra Light
- 🧩 Framework-Agnostic `WIP`

## 📦 Install

```bash
pnpm add just-submit
```

## 🎯 Quickstart

> [!IMPORTANT]  
> Don't forget to add a **default value** for **optional** fields

```ts
const handleSubmit = createSubmit({
  fullName: 'string',
  age: 'number',
  birthday: 'date',
  wantGift: 'boolean',
});

// Inside form submit event handler
handleSubmit((data) => {
  //          ^ { fullName: string; age: number; birthday: Date; wantGift: boolean }
});
```

## 📚 Examples

### Vanilla

```html
<form id="simpleForm">
  <input type="text" name="fullName" required />
  <input type="number" name="age" min="0" required />
  <input type="date" name="birthday" value="2005-03-12" />
  <input type="checkbox" name="wantGift" />
  <button type="submit">SUBMIT</button>
</form>
```

```ts
import { createSubmit } from 'just-submit';

const handleSubmit = createSubmit({
  fullName: 'string',
  age: 'number',
  birthday: 'date',
  wantGift: 'boolean',
});
const form = document.getElementById('simpleForm') as HTMLFormElement;
form.addEventListener(
  'submit',
  handleSubmit((data) => {
    // ...
  }),
);
```

### React

```tsx
import { createSubmit } from 'just-submit';

const Form = () => {
  const handleSubmit = createSubmit({
    fullName: 'string',
    age: 'number',
    birthday: 'date',
    wantGift: 'boolean',
  });
  return (
    <form
      onSubmit={handleSubmit((data) => {
        // ...
      })}
    >
      <input type="text" name="fullName" required />
      <input type="number" name="age" min={0} required />
      <input type="date" name="birthday" defaultValue="2005-03-12" />
      <input type="checkbox" name="wantGift" />
      <button type="submit">SUBMIT</button>
    </form>
  );
};
```

## 🔍 Troubleshooting

### Form Field Converting Error

This library can only convert `string` values from `FormData`.  
For **optional** fields, add a **default value** in case they are `null` in submission.

### How to control form? (watch value changes / form state / etc.)

This library is for simple forms that don't need to be controlled.  
If you are working on a complex form, try [react-hook-form](https://github.com/react-hook-form/react-hook-form) instead.
