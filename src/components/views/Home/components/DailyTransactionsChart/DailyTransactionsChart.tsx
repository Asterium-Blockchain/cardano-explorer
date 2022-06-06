import theme from '@/theme';
import { Flex, Heading } from '@chakra-ui/react';
import moment from 'moment';
import { useMemo } from 'react';
import {
  XAxis,
  YAxis,
  Line,
  ResponsiveContainer,
  Tooltip,
  Area,
  AreaChart,
} from 'recharts';

import CustomTooltip from '@/components/shared/Tooltip';

interface DailyTransactionsChartProps {
  dailyTransactions: any[];
}

const DailyTransactionsChart: React.FC<DailyTransactionsChartProps> = ({
  dailyTransactions,
}) => {
  const mappedData = useMemo(
    () =>
      dailyTransactions.map((t) => ({
        day: moment(t.day).format('MM/DD'),
        count: t.tx_count,
      })),
    [dailyTransactions],
  );

  return (
    <Flex
      height={'100%'}
      flexDir="column"
      p="4"
      border={'1px'}
      gap="4"
      borderRadius="md"
      borderColor={'gray.600'}
    >
      <Heading size={'md'} pt="2" pb={4}>
        Daily transactions
      </Heading>
      <ResponsiveContainer className={'border-box'}>
        <AreaChart data={mappedData}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={theme.colors.purple[300]}
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor={theme.colors.purple[300]}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <XAxis dataKey={'day'} padding={{ left: 24, right: 24 }} />
          <YAxis dataKey={'count'} padding={{ bottom: 24 }} />
          <Line
            type="monotone"
            dataKey="count"
            stroke={theme.colors.purple[300]}
            animationDuration={100}
          />
          <Tooltip
            content={({ active, payload }) => (
              <CustomTooltip active={active} payload={payload} />
            )}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke={theme.colors.purple[300]}
            strokeWidth={2}
            fillOpacity={0.4}
            fill="url(#colorUv)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Flex>
  );
};

export { DailyTransactionsChart };
