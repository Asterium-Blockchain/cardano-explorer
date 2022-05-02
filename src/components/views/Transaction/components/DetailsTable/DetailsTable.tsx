import blockfrost from '@/utils/blockchain/blockfrost';
import { bytesToSize } from '@/utils/strings';
import {
  TableContainer,
  Table,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
} from '@chakra-ui/react';
import moment from 'moment';

interface DetailsTableProps {
  transaction: Awaited<ReturnType<typeof blockfrost.txs>>;
}

const DetailsTable: React.FC<DetailsTableProps> = ({ transaction }) => {
  const {
    hash,
    block_time: blockTime,
    fees,
    slot,
    block_height: blockHeight,
    size,
  } = transaction;

  return (
    <TableContainer
      border={'1px'}
      borderColor="gray.700"
      borderRadius={'md'}
      mt="8"
      borderBottom={'none'}
    >
      <Table>
        <Tbody>
          <Tr>
            <Th>Hash</Th>
            <Td textAlign={'right'}>
              <Text as="code">{hash}</Text>
            </Td>
          </Tr>
          <Tr>
            <Th>Timestamp</Th>
            <Td textAlign={'right'}>
              {moment(blockTime * 1000).format('dddd, MMMM Do YYYY, h:mm:ss A')}
            </Td>
          </Tr>
          <Tr>
            <Th>Block</Th>
            <Td textAlign={'right'}>{blockHeight}</Td>
          </Tr>
          <Tr>
            <Th>Slot</Th>
            <Td textAlign={'right'}>{slot.toLocaleString()}</Td>
          </Tr>
          <Tr>
            <Th>Fees</Th>
            <Td textAlign={'right'}>
              {parseInt(fees, 10) / 1000000}
              <Text fontSize={'xs'} ml="1" display="inline">
                ADA
              </Text>
            </Td>
          </Tr>
          <Tr>
            <Th>Size</Th>
            <Td textAlign={'right'}>
              <Text as="code">{bytesToSize(size)}</Text>
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export { DetailsTable };
