import { GetStaticProps, NextPage } from 'next';

import blockfrost from '@lib/blockfrost';
import Home from '@/components/views/Home';
import prisma from 'prisma/client';
import axios from 'axios';
import koios from '@/utils/koios';
import { dateToSlot } from '@/utils/blockchain/time';
import moment from 'moment';
import SEO from '@/components/shared/SEO';

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
  dailyTransactions: { day: string; tx_count: number }[];
  stakedAdaPercentage: number;
  totalsData: TotalsData;
}

export const getStaticProps: GetStaticProps<HomepageProps> = async () => {
  const latestBlock = await blockfrost.blocksLatest();
  const dailyTransactions = (await prisma.$queryRaw`
  SELECT
    date_trunc('day', b."time") AS "day",
    COUNT(*) AS "tx_count"
  FROM
    tx
  LEFT JOIN "block" b ON
    b.id = tx.block_id
  WHERE
    b.time > NOW() - INTERVAL '168 hours'
  GROUP BY
    1
  ORDER BY
    1
  LIMIT 7;
  `) as any;

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
      dailyTransactions,
      stakedAdaPercentage: stake / supply,
      totalsData: koiosData[0],
    },
    revalidate: 120,
  };
};

const HomePage: NextPage<HomepageProps> = (props) => {
  return (
    <>
      <SEO />
      <Home {...props} />
    </>
  );
};

export default HomePage;
