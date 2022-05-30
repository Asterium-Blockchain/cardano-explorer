import { BuilderErrors } from '@/store/createTransactionBuilderSlice';

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

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function decodeLucidError(error: any) {
  if (error === 'InputsExhaustedError') {
    return BuilderErrors.INPUTS_EXHAUSTED;
  }
  if (error.info && error.info.indexOf('User declined') !== -1) {
    return undefined;
  }
  return BuilderErrors.UNKOWN_ERROR;
}

export const randomID = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

export const isHex = (str: string) => {
  return Boolean(str.match(/^[0-9a-f]+$/i));
};
