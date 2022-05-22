import { QueryType } from '@/types';

const isHex = (value: string) => value.match(/^[0-9a-fA-F]+$/);

export const isAssetID = (value: any): boolean =>
  !!(typeof value === 'string' && value && value.length >= 56 && isHex(value));

export const isPolicyID = (value: any): boolean =>
  !!(typeof value === 'string' && value.length === 56 && isHex(value));

export const isTxHash = (value: any) =>
  !!(typeof value === 'string' && value.length === 64 && isHex(value));

export const isAddress = (value: any) =>
  !!(
    typeof value === 'string' &&
    (value.length === 103 || value.length === 58) &&
    value.match(/addr1[a-z0-9]+/)
  );

export const isStakeKey = (value: any) =>
  !!(
    typeof value === 'string' &&
    value.length === 59 &&
    value.match(/stake1[a-z0-9]+/)
  );

export const deduceType = (value: any) => {
  let type: QueryType = null;

  if (isTxHash(value)) {
    type = 'TX_HASH';
  } else if (isPolicyID(value)) {
    type = 'POLICY_ID';
  } else if (isAssetID(value)) {
    type = 'ASSET_ID';
  } else if (isAddress(value)) {
    type = 'ADDRESS';
  } else if (isStakeKey(value)) {
    type = 'STAKE_KEY';
  }
  return type;
};

export const decodeType = (type: QueryType) => {
  switch (type) {
    case 'TX_HASH':
      return 'Transaction';
    case 'POLICY_ID':
      return 'Policy';
    case 'ASSET_ID':
      return 'Asset';
    case 'ADDRESS':
      return 'Address';
    case 'STAKE_KEY':
      return 'Stake';
    default:
      return 'Unknown';
  }
};

export const getUrlFromType = (type: QueryType, value: string) => {
  switch (type) {
    case 'TX_HASH':
      return '/transaction/' + value;
    case 'POLICY_ID':
      return '/policy/' + value;
    case 'ASSET_ID':
      return '/token/' + value;
    case 'ADDRESS':
      return '/address/' + value;
    case 'STAKE_KEY':
      return '/stake/' + value;
    default:
      return null;
  }
};
