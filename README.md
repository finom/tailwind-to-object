# tailwind-to-object

<p align="center">
<img width="439" alt="image" src="https://github.com/finom/tailwind-to-object/assets/1082083/4e21b15c-0a16-405d-9f9a-06cbf8926f37">
 <br />
<a href="https://www.npmjs.com/package/tailwind-to-object">
<img src="https://badge.fury.io/js/tailwind-to-object.svg" alt="npm version" /> 
</a>
<a href="https://www.typescriptlang.org/">
<img src="https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg" alt="TypeScript" /> 
</a>
<a href="https://github.com/finom/tailwind-to-object/actions/workflows/main.yml">
<img src="https://github.com/finom/tailwind-to-object/actions/workflows/main.yml/badge.svg" alt="Build status" />
</a>
</p>

Fast and simple one-file zero-dependency library of one function that converts Tailwind classes with default configuration to CSS style objects. Perfect for email libraries based on React. Copied from an old project and published because it works too good. Works on front-end, back-end and your microwave.

```sh
npm i tailwind-to-object
# Or
yarn add tailwind-to-object
```

## API

### tailwindToObject

Accepts string of tailwind classes as first argument and returns an object of styles.

```ts
import tailwindToObject from 'tailwind-to-object';

const style = tailwindToObject('text-2xl font-bold text-center text-red-200 bg-[#FFFFFF] !px-3');

console.log(style);
/*
{
    fontSize: '1.5rem',
    fontWeight: '700',
    lineHeight: '2rem',
    textAlign: 'center',
    paddingLeft: '0.75rem !important', 
    paddingRight: '0.75rem !important',
    color: '#FECACA',
    background: '#FFFFFF',
}
*/
```

#### Example usage

You can simulate normal classNames in your React components without actually using them.

Let's create `Div` component that behaves like a normal div with `className` attribute that uses `style` attribute for styling.

```tsx
import React, { CSSProperties, ReactNode } from 'react';
import tailwindToObject from 'tailwind-to-object';

interface Props {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const Div = ({ className, style, children }: Props) => (
    <div style={{
      ...(className ? tailwindToObject(className) : {}),
      ...(style ?? {}),
    }}>
      {children}
    </div>
);

export default Div;
```

Now you can use this component like that:

```tsx
<Div className="mt-6 leading-6 bg-red-400 font-semibold" style={{ ...someOtherStyles }}>
    Hello World
</Div>
```