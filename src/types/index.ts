export type QueryType =
  | 'ASSET_ID'
  | 'POLICY_ID'
  | 'ADDRESS'
  | 'STAKE_KEY'
  | 'TX_HASH'
  | null;
export interface CardanoApi {
  isEnabled: () => Promise<boolean>;
  getBalance: () => Promise<string>;
  getUtxos: (
    amount?: string,
    paginate?: { page: number; limit: number },
  ) => Promise<string[]>;
  getCollateral: () => Promise<string[]>;
  getUsedAddresses: () => Promise<string[]>;
  getUnusedAddresses: () => Promise<string[]>;
  getChangeAddress: () => Promise<string>;
  getRewardAddress: () => Promise<string>;
  getNetworkId: () => Promise<number>;
  signData: (address: string, payload: string) => Promise<any>;
  signTx: (tx: string, partialSign?: boolean) => Promise<string>;
  submitTx: (cbor: string) => Promise<string>;
  experimental: any;
}
