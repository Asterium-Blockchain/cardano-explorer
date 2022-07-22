import { Center, Text, Container, Flex, Heading, Tag } from '@chakra-ui/react';

import { StakeAddressPageProps } from '@/pages/stake/[stakeAddress]';
import { useState } from 'react';
import Paginator from '@/components/shared/Paginator';
import { toADA } from '@/utils/crypto';
import DetailsTable from '@/components/shared/DetailsTable';

const StakeAddress: React.FC<StakeAddressPageProps> = ({
  stakeAddressData,
  poolData,
}) => {
  const {
    stakeAddress,
    controlledLovelace,
    rewardsLovelace,
    withdrawalsLovelace,
  } = stakeAddressData;

  const rows = [
    {
      key: 'stakeAddress',
      header: 'Bech32',
      value: stakeAddress,
    },
    {
      key: 'pool',
      header: 'Delegated Pool',
      value: `${poolData?.name} [${poolData?.ticker}]`,
      hide: !poolData,
      link: `/pool/${poolData?.id}`,
    },
    {
      key: 'totalStake',
      header: 'Total Staked',
      render: () => (
        <>
          {parseInt(toADA(controlledLovelace), 10).toLocaleString()}
          <Text fontSize={'xs'} ml="1" display="inline">
            ADA
          </Text>
        </>
      ),
    },
    {
      key: 'withdrawn',
      header: 'Rewards Withdrawn',
      render: () => (
        <>
          {parseInt(toADA(withdrawalsLovelace), 10).toLocaleString()}
          <Text fontSize={'xs'} ml="1" display="inline">
            ADA
          </Text>
        </>
      ),
    },
    {
      key: 'rewards',
      header: 'Rewards Available',
      render: () => (
        <>
          {parseInt(toADA(rewardsLovelace), 10).toLocaleString()}
          <Text fontSize={'xs'} ml="1" display="inline">
            ADA
          </Text>
        </>
      ),
    },
  ];

  return (
    <Container maxW={'container.xl'} py="12">
      <Flex>
        <Heading size="md" mr="2">
          Stake Address
        </Heading>
      </Flex>

      <DetailsTable rows={rows} />
    </Container>
  );
};

export default StakeAddress;
