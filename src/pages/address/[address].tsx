import { GetStaticPaths, GetStaticProps, NextPage } from 'next';

import { isAddress } from '@/utils/crypto/validation';
import Address from '@/components/views/Address';
import blockfrost from '@/utils/blockchain/blockfrost';
import axios from '@/utils/axios';
import { AddressTransactionsResponse } from '@/pages/api/addresses/[address]/transactions';

export interface AddressPageProps {
  addressData: Awaited<ReturnType<typeof blockfrost.addressesExtended>>;
  transactions: AddressTransactionsResponse['transactions'];
  hasMore: boolean;
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

  const addressData = await blockfrost.addressesExtended(address);
  const { data } = await axios.get<AddressTransactionsResponse>(
    `addresses/${address}/transactions`,
    {
      params: {
        page: 0,
      },
    },
  );

  return {
    props: {
      addressData: addressData,
      transactions: data.transactions,
      hasMore: data.hasMore,
    },
  };
};

const AddressPage: NextPage<AddressPageProps> = (props) => {
  return <Address {...props} />;
};

export default AddressPage;
