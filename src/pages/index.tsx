import { GetStaticProps, NextPage } from 'next';

import blockfrost from '@lib/blockfrost';
import Home from '@/components/views/Home';
import prisma from 'prisma/client';
import axios from 'axios';

export interface HomepageProps {
  latestBlock: Awaited<ReturnType<typeof blockfrost.blocksLatest>>;
  dailyTransactions: any[];
  stakedAdaPercentage: number;
}

export const getStaticProps: GetStaticProps<HomepageProps> = async () => {
  const latestBlock = await blockfrost.blocksLatest();
  // const dailyTransactions = (await prisma.$queryRaw`
  //   SELECT
  //     DATE_TRUNC('day', (b."time")) block_time,
  //     COUNT(*)
  //   FROM
  //     tx t
  //   LEFT JOIN block b ON
  //     b.id = t.block_id
  //   GROUP BYogmios-api.mainnet.dandelion.link
  //     block_time
  //   ORDER BY
  //     block_time DESC
  //   LIMIT 10;
  // `) as any;

  const { data } = await axios.get('https://pool.pm/total.json');
  const { supply, stake } = data;

  return {
    props: {
      latestBlock,
      dailyTransactions: [],
      stakedAdaPercentage: stake / supply,
    },
    revalidate: 120,
  };
};

const HomePage: NextPage<HomepageProps> = (props) => {
  return <Home {...props} />;
};

export default HomePage;
