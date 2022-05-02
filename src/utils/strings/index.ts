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

export function hex2a(hexx: string) {
  const hex = hexx.toString(); //force conversion
  let str = '';
  for (let i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}

export function bytesToSize(bytes: number) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
}
