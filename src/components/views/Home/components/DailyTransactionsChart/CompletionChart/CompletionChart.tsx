import theme from '@/theme';
import { Box, Text } from '@chakra-ui/react';
import { Pie, PieChart, ResponsiveContainer } from 'recharts';

interface CompletionChartProps {
  completion: number;
  title: string;
}
const CompletionChart: React.FC<CompletionChartProps> = ({
  completion,
  title,
}) => {
  const completionHundreds = Math.round(completion * 10000) / 100;
  return (
    <Box height={'50%'}>
      <Box position={'relative'} height="100%">
        <Box
          position={'absolute'}
          top="50%"
          left={'50%'}
          transform={'translate(-50%, -52%)'}
          textAlign="center"
        >
          <Text fontSize={'xl'} fontWeight="bold">
            {completionHundreds}%
          </Text>
          <Text color={'gray.600'} fontSize="sm">
            {title}
          </Text>
        </Box>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={[
                {
                  name: 'Staked ADA',
                  value: completionHundreds,
                  fill: 'rgba(104, 211, 145, 0.3)',
                  stroke: theme.colors.green[300],
                },
                {
                  name: 'Unstaked ADA',
                  value: 100 - completionHundreds,
                  fill: 'none',
                },
              ]}
              dataKey={'value'}
              innerRadius={70}
              outerRadius={90}
              paddingAngle={5}
              stroke="none"
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export { CompletionChart };
