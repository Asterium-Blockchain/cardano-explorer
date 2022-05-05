import { useMemo, useEffect } from 'react';

import { EPOCH_DURATION } from '@/constants';
import useAdaPrice from '@/hooks/useAdaPrice';
import useCountdown from '@/hooks/useCountdown';
import useLatestBlock from '@/hooks/useLatestBlock';
import { formatDuration } from '@/utils/misc';
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
} from '@chakra-ui/react';
import useStore from '@/store/useStore';
import { HomepageProps } from '@/pages';

const Home: React.FC<HomepageProps> = ({ latestBlock }) => {
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
      </Grid>
    </Container>
  );
};

export { Home };
