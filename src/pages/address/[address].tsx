import { GetStaticPaths, GetStaticProps, NextPage } from 'next';

import { isAddress } from '@/utils/crypto/validation';
import Address from '@/components/views/Address';
import blockfrost from '@lib/blockfrost/index';
import { getAddressStakeKey } from '@/utils/crypto';
import { findAdaHandles } from '@/utils/blockchain/assetClasses';
import { stateQueryClient } from '@lib/ogmios';
import scrolls from '@lib/scrolls';
import { connectToDatabase } from '@lib/mongo';

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
  await scrolls.connect();

  const { address } = req.params as { address: string };

  if (!isAddress(address)) {
    return {
      notFound: true,
      revalidate: 1,
    };
  }

  const stakeAddress = getAddressStakeKey(address);

  let lovelace: bigint;
  let tokenCount: number;
  let adaHandles: string[];
  let utxosLength: number;

  const redisKey = `balance.${address}`;
  const cached = await scrolls.hGetAll(redisKey);

  if (!Object.keys(cached).length) {
    const utxos = await stateQueryClient.utxo([address]);

    ({ lovelace, tokenCount, adaHandles } = utxos.reduce(
      (acc, [, output]) => ({
        lovelace: acc.lovelace + BigInt(output.value.coins),
        tokenCount:
          acc.tokenCount + Object.keys(output.value.assets || {}).length,
        adaHandles:
          output.value.assets && acc.adaHandles.length <= 5
            ? (acc.adaHandles as any).concat(
                findAdaHandles(output.value.assets),
              )
            : acc.adaHandles,
      }),
      {
        lovelace: BigInt(0),
        tokenCount: 0,
        adaHandles: [],
      },
    ));

    utxosLength = utxos.length;

    const expiry = Math.floor(utxosLength / 1000);

    await scrolls.hSet(redisKey, 'lovelace', lovelace.toString());
    await scrolls.hSet(redisKey, 'tokenCount', tokenCount);
    await scrolls.hSet(redisKey, 'adaHandles', JSON.stringify(adaHandles));
    await scrolls.hSet(redisKey, 'utxosLength', utxosLength);
    await scrolls.expire(redisKey, expiry);
  } else {
    lovelace = BigInt(cached.lovelace);
    utxosLength = parseInt(cached.utxosLength, 10);
    adaHandles = JSON.parse(cached.adaHandles);
    tokenCount = parseInt(cached.tokenCount, 10);
  }

  // const transactions = await prisma.tx.findMany({
  //   where: {},
  //   take: 25,
  //   page: 1,
  // });

  // const transactions = await blockfrost.addressesTransactions(address, {
  //   count: 26,
  //   page: 1,
  // });

  await scrolls.disconnect();

  return {
    props: {
      // transactions: transactions.slice(0, 25),
      // hasMore: transactions.length === 26,
      transactions: [],
      hasMore: false,
      addressData: {
        stakeAddress: stakeAddress || '',
        lovelaceBalance: lovelace.toString(),
        adaHandles,
        utxoCount: utxosLength,
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
