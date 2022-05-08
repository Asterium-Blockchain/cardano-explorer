import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import moment from 'moment';
import { useMemo } from 'react';
import {
  LineChart,
  XAxis,
  YAxis,
  Line,
  ResponsiveContainer,
  Tooltip,
  Area,
  AreaChart,
} from 'recharts';

interface DailyTransactionsChartProps {
  dailyTransactions: any[];
}

const DailyTransactionsChart: React.FC<DailyTransactionsChartProps> = ({
  dailyTransactions,
}) => {
  const mappedData = useMemo(
    () =>
      dailyTransactions
        .sort(
          (a, b) => moment(a.block_time).unix() - moment(b.block_time).unix(),
        )
        .map((t, i) => ({
          day: moment(t.block_time).format('MM/DD'),
          count: t.count,
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
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey={'day'} padding={{ left: 24, right: 24 }} />
          <YAxis dataKey={'count'} padding={{ bottom: 24 }} />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#8884d8"
            animationDuration={100}
          />
          <Tooltip
            content={({ active, payload }) =>
              active && payload?.length ? (
                <Box
                  p="3"
                  border={'1px'}
                  borderRadius="md"
                  borderColor={'gray.600'}
                >
                  <Text fontSize="sm" fontWeight={'bold'}>
                    Transaction count:{' '}
                    <Text fontSize="xs" fontWeight={'medium'}>
                      {parseInt(
                        payload[0].value!.toString(),
                        10,
                      ).toLocaleString()}
                    </Text>
                  </Text>
                </Box>
              ) : null
            }
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#8884d8"
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
