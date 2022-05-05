import { GetStaticProps, NextPage } from 'next';

import blockfrost from '@/utils/blockchain/blockfrost';
import Home from '@/components/views/Home';

export interface HomepageProps {
  latestBlock: Awaited<ReturnType<typeof blockfrost.blocksLatest>>;
}

export const getStaticProps: GetStaticProps<HomepageProps> = async () => {
  const latestBlock = await blockfrost.blocksLatest();

  return {
    props: {
      latestBlock,
    },
    revalidate: 120,
  };
};

const HomePage: NextPage<HomepageProps> = (props) => {
  return <Home {...props} />;
};

export default HomePage;
