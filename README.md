
<p align="center">
   <br />
<picture>
  <source width="600" media="(prefers-color-scheme: dark)" srcset="./.assets/white.png">
  <source width="600" media="(prefers-color-scheme: light)" srcset="./.assets/dark.png">
  <img width="600" alt="next-smoothie" src="./.assets/dark.png">
</picture>
 <br />
 <strong>Tailwind for email libraries</strong>
<br /><br />
<a href="https://www.npmjs.com/package/tailwind-to-object"><img src="https://badge.fury.io/js/tailwind-to-object.svg" alt="npm version" /></a>
<a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg" alt="TypeScript" /></a>
<a href="https://github.com/finom/tailwind-to-object/actions/workflows/main.yml"><img src="https://github.com/finom/tailwind-to-object/actions/workflows/main.yml/badge.svg" alt="Build status" /></a>
</p>

Fast and simple one-file zero-dependency library of one single-argument function that converts Tailwind classes with default configuration to CSS style objects. Perfect for email libraries based on React. Can be used on front-end, back-end and your microwave if it runs JavaScript.

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

const style = tailwindToObject('text-2xl font-bold text-center !px-3 text-red-200 bg-[#FFFFFF]');

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

You can build a collection of such components for your taste. Here is a random copy-paste:

```tsx
<Table className="w-full border-collapse mt-8 border-t border-l-0 border-r-0 border-b-0 border-solid">
    <tbody>
        {products.map((product) => (
            <tr key={product.id}>
                <Td className="py-4 border-b border-t-0 border-l-0 border-r-0 border-solid">
                <Div className="whitespace-nowrap">
                    <Div className='pt-7 mt-px inline-block mr-4 align-top'>
                        {order.quantityMap[product.id]}
                    </Div>
                    <Div className='pt-4 inline-block mr-4 align-top'>
                    <Div className='inline-block relative'>
                        <Img src={product.images[0].url} width={64} alt="Product image" />
                    </Div>
                    </Div>
                    <Div className="inline-block align-top">
                    <Div className="mb-2">
                        {product.collection.title ?? <em>Unknown type</em>}
                    </Div>
                    <Div className="mb-2">{product.title}</Div>
                    <Div>
                        {product.description?.split(/\n/).map((desc, i) => (
                            <Div key={i}>{desc}</Div>
                        ))}
                    </Div>
                    </Div>
                </Div>
                </Td>
            </tr>
        ))}
    </tbody>
</Table>
```

Enjoy!
