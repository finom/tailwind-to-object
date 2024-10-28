
<p align="center">
   <br />
<picture>
  <source width="600" media="(prefers-color-scheme: dark)" srcset="./assets/white.png">
  <source width="600" media="(prefers-color-scheme: light)" srcset="./assets/dark.png">
  <img width="600" alt="Tailwind to Object" src="./assets/dark.png">
</picture>
 <br />
 <strong>Tailwind for email rendering</strong>
<br /><br />
<a href="https://www.npmjs.com/package/tailwind-to-object"><img src="https://badge.fury.io/js/tailwind-to-object.svg" alt="npm version" /></a>
<a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg" alt="TypeScript" /></a>
<a href="https://github.com/finom/tailwind-to-object/actions/workflows/main.yml"><img src="https://github.com/finom/tailwind-to-object/actions/workflows/main.yml/badge.svg" alt="Build status" /></a>
</p>

Fast and simple zero-dependency library of a single-argument function that converts Tailwind classes of default configuration to style objects using pre-compiled key-value pairs of class names and corresponding styles. Perfect for email rendering! Can be used on front-end, back-end and your microwave if it supports JavaScript. Check [list of supported classes](https://finom.github.io/tailwind-to-object/supported-classes.html) (can take a while to load).

```sh
npm i tailwind-to-object
# Or
yarn add tailwind-to-object
```

## API

### tailwindToObject

Accepts a space-delimited string of Tailwind classes as the only argument and returns an object of camel-cased styles.

```ts
import tailwindToObject from 'tailwind-to-object';

const style = tailwindToObject(`
  text-2xl 
  font-bold 
  text-center 
  !px-3 
  text-red-200 
  bg-[#FFFFFF] 
  border-[5px] 
  -top-4
  w-[calc(100%_-_100px)]
  h-1/2
`);

console.log(style);
/*
{   
    // text-2xl
    fontSize: '1.5rem',
    lineHeight: '2rem',
    // font-bold
    fontWeight: '700',
    // text-center
    textAlign: 'center',
    // !px-3
    paddingLeft: '0.75rem !important', 
    paddingRight: '0.75rem !important',
    // text-red-200
    color: '#FECACA',
    // bg-[#FFFFFF] 
    background: '#FFFFFF',
    // border-[5px]
    borderWidth: '5px',
    // -top-4
    top: '-1rem',
    // w-[calc(100%_-_100px)]
    width: 'calc(100% - 100px)',
    // h-1/2
    height: '50%',
}
*/
```

#### Example usage with React

You can simulate the regular className property in your React component that is going to be converted and applied as a style object. Optionally, install [tailwind-merge](https://www.npmjs.com/package/tailwind-merge) to avoid potential conflicts. Since the library is not related to any framework, you can create something with similar idea for your own environment. Feel free to create a PR to add more examples.

```ts
// tailwindComponents.ts
import { ComponentProps, createElement } from 'react';
import { twMerge } from 'tailwind-merge';
import tailwindToObject from 'tailwind-to-object';

// put your custom classes here
const classesToReplace = {
  'my-custom-class': 'text-[#FF0000] bg-white',
  // since the function doesn't use Tailwind config, you may want to define custom font sizes here
  'text-sm': 'text-[14px]', 
};

const replaceClasses = (classNames: string[]) => {
  const classesToBeApplied = [];

  for (const cls of classNames) {
    if (classesToReplace[cls as keyof typeof classesToReplace]) {
      classesToBeApplied.push(classesToReplace[cls as keyof typeof classesToReplace]);
    } else {
      classesToBeApplied.push(cls);
    }
  }

  return classesToBeApplied;
};

function createTag<T extends keyof JSX.IntrinsicElements>(tag: T) {
  const component = ({ className, style, ...rest }: ComponentProps<T>) => {
    const classNames = replaceClasses(className?.trim().split(/\s+/) ?? []);

    const tailwindStyle = classNames.length ? tailwindToObject(twMerge(...classNames)) : {};
    return createElement(tag, {
      style: { ...tailwindStyle, ...(style ?? {}) },
      ...rest,
    });
  };

  component.displayName = tag;

  return component;
}

export const Div = createTag('div');
export const Span = createTag('span');
export const Table = createTag('table');
export const Tbody = createTag('tbody');
export const Thead = createTag('thead');
export const Tr = createTag('tr');
export const Td = createTag('td');
export const Th = createTag('th');
export const Ul = createTag('ul');
export const Ol = createTag('ol');
export const Li = createTag('li');
export const P = createTag('p');
export const A = createTag('a');
export const Button = createTag('button');
export const Img = createTag('img');
export const H1 = createTag('h1');
export const H2 = createTag('h2');
export const H3 = createTag('h3');
export const H4 = createTag('h4');
export const H5 = createTag('h5');
export const H6 = createTag('h6');

export default createTag;

```

Now you can use the new components like that:

```tsx
import { Div } from './tailwindComponents';
// ...
<Div className="mt-6 leading-6 font-semibold my-custom-class" style={{ ...someOtherStyles }}>
    Hello World
</Div>
```

Note that, by default, if Tailwind class is not supported, `tailwindToObject` is going to throw an error. 
