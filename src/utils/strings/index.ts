export function truncateString(
  str: string,
  num: number,
  position: 'end' | 'middle' = 'end',
) {
  if (!str) return;
  if (str.length > num) {
    if (position === 'end') {
      return str.slice(0, num) + '..';
    }

    if ((position = 'middle')) {
      return str.slice(0, num / 2) + '..' + str.slice(str.length - num / 2);
    }
  } else {
    return str;
  }
}
