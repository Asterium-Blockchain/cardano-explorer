import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import { toHex } from 'lucid-cardano';

const prisma = new PrismaClient();

const convertBigInts = (raw: any) => {
  const result: any = {};
  Object.entries(raw).forEach(([key, val]) => {
    if (typeof val === 'bigint') {
      result[key] = val.toString();
    } else if (val instanceof Buffer) {
      result[key] = toHex(val);
    } else if (val instanceof Decimal) {
      result[key] = val.toString();
    } else if (typeof val === 'object' && val !== null) {
      result[key] = convertBigInts(val);
    } else {
      result[key] = val;
    }
  });
  return result;
};

prisma.$use(async (params, next) => {
  const raw = await next(params);

  if (Array.isArray(raw)) {
    return raw.map((item) => convertBigInts(item));
  }

  return convertBigInts(raw);
});

export default prisma;
