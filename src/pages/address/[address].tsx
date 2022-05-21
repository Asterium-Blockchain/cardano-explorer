import { GetStaticPaths, GetStaticProps, NextPage } from 'next';

import { isAddress } from '@/utils/crypto/validation';
import Address from '@/components/views/Address';
import blockfrost from '@lib/blockfrost/index';
import { getAddressStakeKey } from '@/utils/crypto';
import { ADA_HANDLE_POLICY_ID } from '@/constants';
import { stateQueryClient } from '@lib/ogmios';
import { Assets } from 'lucid-cardano';
import { hex2a } from '@/utils/strings';
import { findAdaHandles } from '@/utils/blockchain/assetClasses';

interface AddressData {
  stakeAddress: string;
  lovelaceBalance: string;
  tokenCount: number;
  isScript: boolean;
  adaHandles: string[];
  address: string;
  utxoCount: number;
}
export interface AddressPageProps {
  transactions: Awaited<ReturnType<typeof blockfrost.addressesTransactions>>;
  hasMore: boolean;
  addressData: AddressData;
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    fallback: 'blocking',
    paths: [],
  };
};

export const getStaticProps: GetStaticProps<AddressPageProps> = async (req) => {
  const { address } = req.params as { address: string };

  if (!isAddress(address)) {
    return {
      notFound: true,
      revalidate: 1,
    };
  }

  const stakeAddress = getAddressStakeKey(address);

  const utxos = await stateQueryClient.utxo([address]);

  const { lovelace, tokenCount, adaHandles } = utxos.reduce(
    (acc, [, output]) => ({
      lovelace: acc.lovelace + BigInt(output.value.coins),
      tokenCount:
        acc.tokenCount + Object.keys(output.value.assets || {}).length,
      adaHandles:
        output.value.assets && acc.adaHandles.length <= 5
          ? (acc.adaHandles as any).concat(findAdaHandles(output.value.assets))
          : acc.adaHandles,
    }),
    {
      lovelace: BigInt(0),
      tokenCount: 0,
      adaHandles: [],
    },
  );

  // const transactions = await blockfrost.addressesTransactions(address, {
  //   count: 26,
  //   page: 1,
  // });

  return {
    props: {
      transactions: [],
      hasMore: false, // transactions.length === 26,
      addressData: {
        stakeAddress: stakeAddress || '',
        lovelaceBalance: lovelace.toString(),
        adaHandles,
        utxoCount: utxos.length,
        address,
        isScript: false,
        tokenCount,
      },
    },
  };
};

const AddressPage: NextPage<AddressPageProps> = (props) => {
  return <Address {...props} />;
};

export default AddressPage;
