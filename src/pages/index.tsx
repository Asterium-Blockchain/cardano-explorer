import { GetStaticProps, NextPage } from 'next';

import blockfrost from '@lib/blockfrost';
import Home from '@/components/views/Home';
import prisma from 'prisma/client';
import axios from 'axios';
import koios from '@/utils/koios';

interface TotalsData {
  epoch_no: number;
  circulation: string;
  treasury: string;
  reward: string;
  reserves: string;
  supply: string;
}

export interface HomepageProps {
  latestBlock: Awaited<ReturnType<typeof blockfrost.blocksLatest>>;
  dailyTransactions: any[];
  stakedAdaPercentage: number;
  totalsData: TotalsData;
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
  const { data: koiosData } = await koios.get<[TotalsData]>('totals', {
    params: {
      _epoch_no: latestBlock.epoch,
    },
  });
  const { supply, stake } = data;

  return {
    props: {
      latestBlock,
      dailyTransactions: [],
      stakedAdaPercentage: stake / supply,
      totalsData: koiosData[0],
    },
    revalidate: 120,
  };
};

const HomePage: NextPage<HomepageProps> = (props) => {
  return <Home {...props} />;
};

export default HomePage;
