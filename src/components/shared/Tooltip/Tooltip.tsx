import { Box, Text } from '@chakra-ui/react';

interface TooltipProps {
  active?: boolean;
  payload: any;
}

const Tooltip: React.FC<TooltipProps> = ({ active, payload }) =>
  active && payload?.length ? (
    <Box p="3" border={'1px'} borderRadius="md" borderColor={'gray.600'}>
      <Text fontSize="sm" fontWeight={'bold'}>
        Transaction count:{' '}
        <Text fontSize="xs" fontWeight={'medium'}>
          {parseInt(payload[0].value!.toString(), 10).toLocaleString()}
        </Text>
      </Text>
    </Box>
  ) : (
    <></>
  );

export { Tooltip };
