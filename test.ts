import assert from 'node:assert';
import tailwindToObject from '.';

assert.deepStrictEqual(tailwindToObject('text-2xl font-bold text-center text-red-200 bg-[#FFFFFF] !px-3'), {
  fontSize: '1.5rem',
  fontWeight: '700',
  lineHeight: '2rem',
  textAlign: 'center',
  paddingLeft: '0.75rem !important',
  paddingRight: '0.75rem !important',
  color: '#FECACA',
  background: '#FFFFFF',
});

// NOT IMPLEMENTED
// Feel free to pull request
/*
// Exact font size
expect(tailwindToObject('text-[12px]')).to.eql({
    fontSize: '12px',
});

// Using negative values
expect(tailwindToObject('-px-3')).to.eql({ paddingLeft: '-0.75rem', paddingRight: '-0.75rem' });
*/
