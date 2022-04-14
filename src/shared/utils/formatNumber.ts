export default function formatNumber(fieldNumber: number | string): string {
  const number = Number(fieldNumber);

  const symbols = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
  ];

  const rgx = /\.0+$|(\.[0-9]*[1-9])0+$/;

  let i;

  for (i = symbols.length - 1; i > 0; i -= 1) {
    if (number >= symbols[i].value) {
      break;
    }
  }

  const divide = number / symbols[i].value;

  const toFixed = divide > 100 ? 0 : 1;

  const formattedNumber =
    divide.toFixed(toFixed).replace(rgx, '$1') + symbols[i].symbol;

  return formattedNumber;
}
