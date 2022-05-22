import theme from '@/theme';
import { Box, LayoutProps, Text } from '@chakra-ui/react';
import { PieChart, Pie } from 'recharts';
import { hexToRgba } from '@/utils/misc';

interface CompletionChartProps {
  completion: number;
  title: string;
  height: LayoutProps['height'];
  color?: string;
}
const CompletionChart: React.FC<CompletionChartProps> = ({
  completion,
  title,
  height,
  color = theme.colors.green[300],
}) => {
  const completionHundreds = Math.round(completion * 10000) / 100;
  const chartData = [
    {
      value: completionHundreds,
      fill: hexToRgba(color, 0.2),
      stroke: color,
    },
    {
      value: 100 - completionHundreds,
      fill: 'none',
    },
  ];
  return (
    <Box height={height}>
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
        <PieChart width={240} height={210}>
          <Pie
            data={chartData}
            dataKey={'value'}
            innerRadius={70}
            outerRadius={90}
            paddingAngle={5}
            stroke="none"
          />
        </PieChart>
      </Box>
    </Box>
  );
};

export { CompletionChart };
