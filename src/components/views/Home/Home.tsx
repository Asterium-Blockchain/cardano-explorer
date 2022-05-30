import styles from './styles.module.scss';

import { useMemo, useEffect } from 'react';

import { ADA_MAX_SUPPLY, EPOCH_DURATION } from '@/constants';
import useAdaPrice from '@/hooks/useAdaPrice';
import useCountdown from '@/hooks/useCountdown';
import useLatestBlock from '@/hooks/useLatestBlock';
import { formatDuration, hexToRgba } from '@/utils/misc';
import {
  Container,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Skeleton,
  Spacer,
  Icon,
  Text,
} from '@chakra-ui/react';
import useStore from '@/store/useStore';
import { HomepageProps } from '@/pages';
import DailyTransactionsChart from './components/DailyTransactionsChart';
import CompletionChart from './components/DailyTransactionsChart/CompletionChart';
import { ChevronRightIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import { Settings, Tablet, Tool } from 'react-feather';
import theme from '@/theme';

const Home: React.FC<HomepageProps> = ({
  latestBlock,
  dailyTransactions,
  stakedAdaPercentage,
  totalsData,
}) => {
  const adaPrice = useAdaPrice();
  const realtimeLatestBlock = useLatestBlock();

  const change24 = useStore((state) => state.change24hs);

  const { epoch, epoch_slot: epochSlot, slot, height } = latestBlock;

  const [epochCountdown, { start }] = useCountdown({
    seconds: EPOCH_DURATION - (epochSlot || 0),
    interval: 1000,
  });

  const [slotCountUp, { start: startSlotCountUp }] = useCountdown({
    interval: 1000,
    seconds: slot || 0,
    isIncrement: true,
  });

  const [epochSlotCountUp, { start: startEpochSlotCountUp }] = useCountdown({
    interval: 1000,
    seconds: epochSlot || 0,
    isIncrement: true,
  });

  const humanizedEpochCountdown = useMemo(
    () => formatDuration(epochCountdown * 1000),
    [epochCountdown],
  );

  useEffect(() => {
    start();
    startSlotCountUp();
    startEpochSlotCountUp();
  }, [start, startSlotCountUp, startEpochSlotCountUp]);

  return (
    <Container maxW="container.xl" margin={'auto'}>
      <Grid
        templateRows={'repeat(12, 1fr)'}
        templateColumns={'repeat(12, 1fr)'}
        gap="6"
        my={4}
      >
        <GridItem
          colSpan={3}
          rowSpan={3}
          bg="gray.700"
          p={'6'}
          borderRadius="md"
        >
          <Stat>
            <StatLabel>ADA/USD</StatLabel>
            <StatNumber>
              {adaPrice ? (
                `\$${adaPrice}`
              ) : (
                <Skeleton mt={'2'} h={6} w={32} noOfLines={1} />
              )}
            </StatNumber>
            <StatHelpText mb={'0'}>
              {change24 ? (
                <>
                  <StatArrow type={change24 > 0 ? 'increase' : 'decrease'} />
                  {change24?.toFixed(4)}%
                </>
              ) : (
                <Skeleton h={4} w={10} noOfLines={1} mt="2" />
              )}
            </StatHelpText>
          </Stat>
        </GridItem>
        <GridItem
          colSpan={3}
          rowSpan={3}
          border="1px"
          p={'6'}
          borderRadius="md"
          borderColor={'gray.600'}
        >
          <Stat>
            <StatLabel>Epoch</StatLabel>
            <StatNumber>{epoch}</StatNumber>
            <StatHelpText>Ends in {humanizedEpochCountdown}</StatHelpText>
          </Stat>
        </GridItem>
        <GridItem
          colSpan={3}
          rowSpan={3}
          border="1px"
          p={'6'}
          borderRadius="md"
          borderColor={'gray.600'}
        >
          <Stat>
            <StatLabel>Slot</StatLabel>
            <StatNumber>{slotCountUp}</StatNumber>
            <StatHelpText>
              {epochSlotCountUp} / {EPOCH_DURATION}
            </StatHelpText>
          </Stat>
        </GridItem>
        <GridItem
          colSpan={3}
          rowSpan={3}
          border="1px"
          borderColor={'gray.600'}
          p={'6'}
          borderRadius="md"
        >
          <Stat>
            <StatLabel>Block height</StatLabel>
            <StatNumber>
              {realtimeLatestBlock ? realtimeLatestBlock.height : height}
            </StatNumber>
          </Stat>
        </GridItem>
        <GridItem colSpan={9} rowSpan={9}>
          <DailyTransactionsChart dailyTransactions={dailyTransactions} />
        </GridItem>
        <GridItem
          colSpan={3}
          rowSpan={9}
          border="1px"
          borderColor={'gray.600'}
          p={'6'}
          borderRadius="md"
        >
          <CompletionChart
            completion={stakedAdaPercentage}
            title={'Staked ADA'}
            height="50%"
          />
          <Spacer height={'5'} />
          <CompletionChart
            completion={
              parseInt(
                (
                  (BigInt(totalsData.circulation) * BigInt(1000000)) /
                  ADA_MAX_SUPPLY
                ).toString(),
                10,
              ) / 1000000
            }
            title={'Minted / Total'}
            height="50%"
            color={theme.colors.purple[400]}
          />
        </GridItem>
        <GridItem
          colSpan={4}
          rowSpan={2}
          bgColor={hexToRgba(theme.colors.pink[500], 0.2)}
          p={'6'}
          borderRadius="md"
        >
          <Link href={'/transaction-builder'}>
            <a className={styles.link}>
              <Icon as={Tool} w={6} h={6} />
              <Text fontSize="lg">Transaction builder</Text>
              <ChevronRightIcon className={styles.animateOnLinkHover} />
            </a>
          </Link>
        </GridItem>
        <GridItem
          colSpan={4}
          rowSpan={2}
          bgColor={hexToRgba(theme.colors.cyan[400], 0.1)}
          p={'6'}
          borderRadius="md"
        >
          <Link href={'/protocol-parameters'}>
            <a className={styles.link}>
              <Icon as={Settings} w={6} h={6} />
              <Text fontSize="lg">Protocol parameters</Text>
              <ChevronRightIcon className={styles.animateOnLinkHover} />
            </a>
          </Link>
        </GridItem>
        <GridItem
          colSpan={4}
          rowSpan={2}
          bgColor={hexToRgba(theme.colors.green[400], 0.2)}
          p={'6'}
          borderRadius="md"
        >
          <Link href={'/transaction-builder'}>
            <a className={styles.link}>
              <Icon as={Tablet} w={6} h={6} />
              <Text fontSize="lg">Pools</Text>
              <ChevronRightIcon className={styles.animateOnLinkHover} />
            </a>
          </Link>
        </GridItem>
      </Grid>
    </Container>
  );
};

export { Home };
