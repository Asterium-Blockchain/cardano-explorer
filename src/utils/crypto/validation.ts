import { QueryType } from '@/types';
import * as CardanoWasmBrowser from '@emurgo/cardano-serialization-lib-browser';
import base58 from 'base-58';

const isHex = (value: string) => value.match(/^[0-9a-fA-F]+$/);

export const isAssetID = (value: any): boolean =>
  !!(typeof value === 'string' && value && value.length >= 56 && isHex(value));

export const isPolicyID = (value: any): boolean =>
  !!(typeof value === 'string' && value.length === 56 && isHex(value));

export const isTxHash = (value: any) =>
  !!(typeof value === 'string' && value.length === 64 && isHex(value));

export const isEnterpriseAddress = (address: string) => {
  try {
    const decodedAddress = CardanoWasmBrowser.ByronAddress.from_bytes(
      base58.decode(address),
    ).to_address();
    return !!decodedAddress;
  } catch (error) {
    return false;
  }
};

export const isAddress = (address: string): boolean => {
  try {
    const isValid = CardanoWasmBrowser.Address.from_bech32(
      address.toUpperCase(),
    );
    return !!isValid;
  } catch (error) {
    return isEnterpriseAddress(address);
  }
};

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
      return '/tokenPolicy/' + value;
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
