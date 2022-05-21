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
  utxoCount: number;
  adaHandles: string[];
}

const DetailsTable: React.FC<DetailsTableProps> = ({
  balance,
  stakeKey,
  tokenCount,
  address,
  utxoCount,
  adaHandles,
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
              {parseInt(toADA(balance), 10).toLocaleString()}
              <Text fontSize={'xs'} ml="1" display="inline">
                ADA
              </Text>
            </Td>
          </Tr>
          <Tr>
            <Th>Native token{tokenCount !== 1 && 's'}</Th>
            <Td textAlign={'right'}>
              <Text as="code">{tokenCount.toLocaleString()}</Text>
            </Td>
          </Tr>
          <Tr>
            <Th>UTxOs</Th>
            <Td textAlign={'right'}>
              <Text as="code">{utxoCount.toLocaleString()}</Text>
            </Td>
          </Tr>
          {adaHandles.length > 0 && (
            <Tr>
              <Th>ADA Handle</Th>
              <Td textAlign={'right'}>
                {adaHandles.map((handle) => {
                  return (
                    <Badge as="code" colorScheme={'orange'} key={handle} ml="2">
                      ${handle}
                    </Badge>
                  );
                })}
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export { DetailsTable };
