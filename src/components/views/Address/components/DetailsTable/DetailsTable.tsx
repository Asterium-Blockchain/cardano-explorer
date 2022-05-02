import { toADA } from '@/utils/crypto';
import {
  Badge,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Tr,
} from '@chakra-ui/react';

interface DetailsTableProps {
  balance: string;
  stakeKey: string | null;
  tokenCount: number;
  address: string;
  adaHandle?: string;
}

const DetailsTable: React.FC<DetailsTableProps> = ({
  balance,
  stakeKey,
  tokenCount,
  address,
  adaHandle,
}) => {
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
            <Th>Bech32</Th>
            <Td textAlign={'right'}>
              <Text as="code">{address}</Text>
            </Td>
          </Tr>
          {stakeKey && (
            <Tr>
              <Th>Stake key</Th>
              <Td textAlign={'right'}>
                <Text as="code">{stakeKey}</Text>
              </Td>
            </Tr>
          )}
          <Tr>
            <Th>Balance</Th>
            <Td textAlign={'right'}>
              {toADA(balance)}
              <Text fontSize={'xs'} ml="1" display="inline">
                ADA
              </Text>
            </Td>
          </Tr>
          <Tr>
            <Th>Native tokens</Th>
            <Td textAlign={'right'}>
              <Text as="code">{tokenCount}</Text>
            </Td>
          </Tr>
          {adaHandle && (
            <Tr>
              <Th>ADA Handle</Th>
              <Td textAlign={'right'}>
                <Badge as="code" colorScheme={'orange'}>
                  ${adaHandle}
                </Badge>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export { DetailsTable };
