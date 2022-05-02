import { GetStaticPaths, GetStaticProps, NextPage } from 'next';

import { isAddress } from '@/utils/crypto/validation';
import Address from '@/components/views/Address';
import blockfrost from '@/utils/blockchain/blockfrost';

interface AddressPageProps {
  addressData: Awaited<ReturnType<typeof blockfrost.addressesExtended>>;
  transactions: Awaited<ReturnType<typeof blockfrost.addressesTransactions>>;
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
  const transactions = await blockfrost.addressesTransactions(address);

  return {
    props: {
      addressData: addressData,
      transactions,
    },
  };
};

const AddressPage: NextPage<AddressPageProps> = (props) => {
  return <Address {...props} />;
};

export default AddressPage;
