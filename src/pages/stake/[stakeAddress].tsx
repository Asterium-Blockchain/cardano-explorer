import { GetStaticPaths, GetStaticProps, NextPage } from 'next';

import { isStakeKey } from '@/utils/crypto/validation';
import StakeAddress from '@/components/views/StakeAddress';
import blockfrost from '@lib/blockfrost';

export const getStaticPaths: GetStaticPaths = () => {
  return {
    fallback: 'blocking',
    paths: [],
  };
};

interface PoolData {
  name: string;
  id: string;
  ticker: string;
}

interface StakeAddressData {
  stakeAddress: string;
  controlledLovelace: string;
  withdrawalsLovelace: string;
  rewardsLovelace: string;
}

export interface StakeAddressPageProps {
  stakeAddressData: StakeAddressData;
  poolData?: PoolData;
}

export const getStaticProps: GetStaticProps<StakeAddressPageProps> = async (
  req,
) => {
  const { stakeAddress } = req.params as { stakeAddress: string };

  if (!isStakeKey(stakeAddress)) {
    return {
      notFound: true,
      revalidate: 1,
    };
  }

  const stakeResponse = await blockfrost.accounts(stakeAddress);
  const stakeData: StakeAddressData = {
    stakeAddress,
    controlledLovelace: stakeResponse.controlled_amount,
    withdrawalsLovelace: stakeResponse.withdrawals_sum,
    rewardsLovelace: stakeResponse.withdrawable_amount,
  };

  let poolData: PoolData | undefined;

  if (stakeResponse.pool_id) {
    const poolResponse = await blockfrost.poolMetadata(stakeResponse.pool_id);
    poolData = {
      name: poolResponse.name || '',
      id: stakeResponse.pool_id,
      ticker: poolResponse.ticker || '',
    };
  }

  return {
    props: {
      stakeAddressData: stakeData,
      poolData,
    },
  };
};

const StakeAddressPage: NextPage<StakeAddressPageProps> = (props) => {
  return <StakeAddress {...props} />;
};

export default StakeAddressPage;
