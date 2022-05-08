import { GetStaticProps, NextPage } from 'next';

import blockfrost from '@/utils/blockchain/blockfrost';
import Home from '@/components/views/Home';
import prisma from 'prisma/client';

export interface HomepageProps {
  latestBlock: Awaited<ReturnType<typeof blockfrost.blocksLatest>>;
  dailyTransactions: any[];
}

export const getStaticProps: GetStaticProps<HomepageProps> = async () => {
  const latestBlock = await blockfrost.blocksLatest();
  const dailyTransactions = (await prisma.$queryRaw`
    SELECT 
      DATE_TRUNC('day', (b."time")) block_time,
      COUNT(*)
    FROM
      tx t
    LEFT JOIN block b ON
      b.id = t.block_id
    GROUP BY
      block_time
    ORDER BY
      block_time DESC
    LIMIT 10;
  `) as any;

  return {
    props: {
      latestBlock,
      dailyTransactions,
    },
    revalidate: 120,
  };
};

const HomePage: NextPage<HomepageProps> = (props) => {
  return <Home {...props} />;
};

export default HomePage;
