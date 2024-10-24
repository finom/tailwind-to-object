import generatedStyles from './generated.json';;

function camelCase(str: string) {
  return str.replace(/-(.)/g, function (match, chr: string) {
    return chr.toUpperCase();
  });
}

function mapValues<T, U>(
  obj: Record<string, T>,
  iteratee: (value: T, key: string, obj: Record<string, T>) => U
): Record<string, U> {
  const result: Record<string, U> = {};
  for (const key of Object.keys(obj)) {
    result[key] = iteratee(obj[key], key, obj);
  }
  return result;
}

const arbitrarySupportedClasses = {
  pt: 'padding-top',
  pb: 'padding-bottom',
  pl: 'padding-left',
  pr: 'padding-right',
  p: 'padding',
  mb: 'margin-bottom',
  m: 'margin',
  mt: 'margin-top',
  ml: 'margin-left',
  mr: 'margin-right',
  w: 'width',
  h: 'height',
  top: 'top',
  bottom: 'bottom',
  left: 'left',
  right: 'right',
  bg: 'background',
  text: (value: string) => value.startsWith('rgb') || value.startsWith('#') ? 'text-color' : 'font-size',
  'min-w': 'min-width',
  'max-w': 'max-width',
  border: 'border-width',
};

export default function tailwindToObject(selector: string) {
  if (!selector) return {};
  const styleAttr = {};

  selector
    .trim()
    .split(/\s+/)
    .forEach((s) => {
      let important = false;
      if (s.startsWith('!')) {
        important = true;
        // eslint-disable-next-line no-param-reassign
        s = s.slice(1);
      }
      if (s.includes('[')) {
        const property = s.split('-[')[0].replace('.', '') as keyof typeof arbitrarySupportedClasses;
        const properyValue = s.match(/(?<=\[)[^\][]*(?=])/g)?.[0]?.replace(/_/g, ' ');
        const value = arbitrarySupportedClasses[property];
        if (value) {
          Object.assign(styleAttr, {
            [camelCase(typeof value === 'function' ? value(properyValue ?? '') : value)]: properyValue + (important ? ' !important' : ''),
          });
        } else {
          throw new Error(`No style found for selector: ${s}`);
        }
      } else {
        const style = generatedStyles[s as keyof typeof generatedStyles];
        if (!style) {
          throw new Error(`No style found for selector: ${s}`);
        }

        Object.assign(
          styleAttr,
          mapValues(style, (value) => (important ? `${value} !important` : value))
        );
      }
    });

  return styleAttr;
}
