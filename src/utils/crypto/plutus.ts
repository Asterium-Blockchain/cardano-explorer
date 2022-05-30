import { Construct, Data } from 'lucid-cardano';

type JSONPlutusData =
  | { constructor: number; fields: JSONPlutusData[] }
  | { int: number }
  | { bytes: string }
  | { string: string }
  | { list: JSONPlutusData[] }
  | { map: { k: JSONPlutusData; v: JSONPlutusData }[] };

const jsonToPlutus = (json: JSONPlutusData): any => {
  if ('list' in json) {
    return json.list.map((e) => jsonToPlutus(e));
  }
  if (
    'constructor' in json &&
    'fields' in json &&
    typeof json['constructor'] === 'number'
  ) {
    return new Construct(
      json['constructor'],
      json.fields.map((e) => jsonToPlutus(e)),
    );
  }
  if ('int' in json) {
    return BigInt(json.int);
  }
  if ('bytes' in json) {
    return json.bytes;
  }
  if ('map' in json) {
    return json.map;
  }
  if ('string' in json) {
    return Buffer.from(json.string).toString('hex');
  }

  throw new Error('Conversion failed');
};

export const jsonToPlutusHex = (json: JSONPlutusData): string => {
  const plutus = jsonToPlutus(json);
  return Data.to(plutus);
};
