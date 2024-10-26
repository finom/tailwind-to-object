import generatedStyles from './generated.json';;

const camelCase = (str: string) => {
  return str.replace(/-(.)/g, function (match, chr: string) {
    return chr.toUpperCase();
  });
}

const mapValues = <T, U>(
  obj: Record<string, T>,
  iteratee: (value: T, key: string, obj: Record<string, T>) => U
): Record<string, U> => {
  const result: Record<string, U> = {};
  for (const key of Object.keys(obj)) {
    result[key] = iteratee(obj[key], key, obj);
  }
  return result;
}

const isColor = (value: string) =>
  value.startsWith('rgb(') || value.startsWith('rgba(') || value.startsWith('#');

const supportedLiteralClasses = {
  pt: 'padding-top',
  pb: 'padding-bottom',
  pl: 'padding-left',
  pr: 'padding-right',
  p: 'padding',
  px: ['padding-left', 'padding-right'],
  py: ['padding-top', 'padding-bottom'],
  mb: 'margin-bottom',
  mt: 'margin-top',
  ml: 'margin-left',
  mr: 'margin-right',
  m: 'margin',
  mx: ['margin-left', 'margin-right'],
  my: ['margin-top', 'margin-bottom'],
  w: 'width',
  h: 'height',
  min: 'min-width',
  max: 'max-width',
  inset: 'inset',
  top: 'top',
  bottom: 'bottom',
  left: 'left',
  right: 'right',
  bg: 'background',
  text: (value: string) => (isColor(value) ? 'color' : 'font-size'),
  border: (value: string) => (isColor(value) ? 'border-color' : 'border-width'),
  rounded: 'border-radius',
  opacity: 'opacity',
  z: 'z-index',
  order: 'order',
  grow: 'flex-grow',
  shrink: 'flex-shrink',
  gap: 'gap',
  'gap-x': 'column-gap',
  'gap-y': 'row-gap',
  leading: 'line-height',
  tracking: 'letter-spacing',
  'font-size': 'font-size',
  'font-family': 'font-family',
  'font-weight': 'font-weight',
  shadow: 'box-shadow',
  content: 'content',
  'transition-duration': 'transition-duration',
  'transition-delay': 'transition-delay',
  cursor: 'cursor',
  outline: (value: string) => (isColor(value) ? 'outline-color' : 'outline-width'),
  fill: 'fill',
  stroke: 'stroke',
  'stroke-width': 'stroke-width',
  'fill-opacity': 'fill-opacity',
  'stroke-opacity': 'stroke-opacity',
  object: 'object-position',
  'grid-cols': 'grid-template-columns',
  'grid-rows': 'grid-template-rows',
  list: 'list-style-type',
};


export default function tailwindToObject(className: string) {
  if (!className) return {};
  const styleAttr = {} as Record<string, string>;

  className
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
        const property = s.split('-[')[0].replace('.', '') as keyof typeof supportedLiteralClasses;
        const properyValue = s.match(/(?<=\[)[^\][]*(?=])/g)?.[0]?.replace(/_/g, ' ');
        const value = supportedLiteralClasses[property];
        if (value) {
          let properties = typeof value === 'function' ? value(properyValue ?? '') : value;
          if(!Array.isArray(properties)) {
            properties = [properties];
          }
          properties.forEach((prop) => {
            styleAttr[camelCase(prop)] =  properyValue + (important ? ' !important' : '');
          });
        } else {
          throw new Error(`No style found for class: ${s}`);
        }
      } else {
        const style = generatedStyles[s as keyof typeof generatedStyles];
        if (!style) {
          throw new Error(`No style found for class: ${s}`);
        }

        Object.assign(
          styleAttr,
          mapValues(style, (value) => (important ? `${value} !important` : value))
        );
      }
    });

  return styleAttr;
}
