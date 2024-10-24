import assert from 'node:assert';
import tailwindToObject from './src';

assert.deepStrictEqual(tailwindToObject('text-2xl font-bold text-center text-red-200 bg-[#FFFFFF] !px-3 border-[5px] -top-4'), {
  fontSize: '1.5rem',
  fontWeight: '700',
  lineHeight: '2rem',
  textAlign: 'center',
  paddingLeft: '0.75rem !important',
  paddingRight: '0.75rem !important',
  color: '#FECACA',
  background: '#FFFFFF',
  borderWidth: '5px',
  top: '-1rem',
});
