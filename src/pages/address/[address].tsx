import { GetStaticPaths, GetStaticProps, NextPage } from 'next';

import { isAddress } from '@/utils/crypto/validation';
import Address from '@/components/views/Address';
import blockfrost from '@/utils/blockchain/blockfrost';
import { getAddressStakeKey } from '@/utils/crypto';
import prisma from 'prisma/client';
import { ADA_HANDLE_POLICY_ID } from '@/constants';
import koios from '@/utils/koios';

interface AddressData {
  stakeAddress: string;
  lovelaceBalance: string;
  tokenCount: number;
  isScript: boolean;
  adaHandle: string;
  address: string;
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

  const transactions = await blockfrost.addressesTransactions(address, {
    count: 26,
    page: 1,
  });

  // const queryResult = await prisma.$queryRaw`
  // `

  // const { data } = await koios.get(`address_info?address=${address}`);

  return {
    props: {
      transactions,
      hasMore: transactions.length === 26,
      // TODO: Calculate these things
      addressData: {
        stakeAddress: stakeAddress || '',
        lovelaceBalance: '12312312312' || '0',
        adaHandle: 'martin',
        address,
        isScript: false,
        tokenCount: 20,
      },
    },
  };
};

const AddressPage: NextPage<AddressPageProps> = (props) => {
  return <Address {...props} />;
};

export default AddressPage;
