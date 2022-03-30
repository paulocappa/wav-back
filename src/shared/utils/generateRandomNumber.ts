export default function generateRandomNumber(length = 6): number {
  const minLength = 10 ** (length - 1);
  const maxLength = 9 * minLength;

  const value = Math.floor(minLength + Math.random() * maxLength);

  return value;
}
