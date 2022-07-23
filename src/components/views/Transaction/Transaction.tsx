import blockfrost from '@lib/blockfrost';
import {
  Box,
  Container,
  Flex,
  Heading,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { TransactionInput } from './components/TransactionInput/TransactionInput';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { Amount } from '@/types';
import { bytesToSize, hex2a } from '@/utils/strings';
import Link from '@/components/shared/Link';
import moment from 'moment';
import DetailsTable from '@/components/shared/DetailsTable';

interface TransactionProps {
  transaction: Awaited<ReturnType<typeof blockfrost.txs>>;
  utxos: Awaited<ReturnType<typeof blockfrost.txsUtxos>>;
  metadata: Awaited<ReturnType<typeof blockfrost.txsMetadata>>;
  mintAmount: Amount | null;
}

const Transaction: React.FC<TransactionProps> = ({
  transaction,
  utxos,
  metadata,
  mintAmount,
}) => {
  const rows = [
    { key: 'hash', header: 'Hash', value: transaction.hash },
    {
      key: 'timestamp',
      header: 'Timestamp',
      value: moment(transaction.block_time * 1000).format(
        'dddd, MMMM Do YYYY, h:mm:ss A',
      ),
    },
    {
      key: 'block',
      header: 'Block',
      value: transaction.block_height.toLocaleString(),
    },
    { key: 'slot', header: 'Slot', value: transaction.slot.toLocaleString() },
    { key: 'fees', header: 'Fees', value: transaction.fees, isAda: true },
    { key: 'size', header: 'Size', value: bytesToSize(transaction.size) },
  ];
  return (
    <Container size={'container.xl'} py={'12'} maxW={'container.xl'}>
      <Flex>
        <Heading size={'md'} mr="2">
          Transaction
        </Heading>
        {utxos.inputs.find((i) => !!i.data_hash) && (
          <Tag size={'sm'} mt="1" mr="2" colorScheme={'cyan'}>
            Consuming from a script
          </Tag>
        )}
        {utxos.outputs.find((o) => !!o.data_hash) && (
          <Tag size={'sm'} mt="1" colorScheme={'pink'}>
            Sending to a script
          </Tag>
        )}
      </Flex>

      <DetailsTable rows={rows} />

      <Tabs variant={'enclosed'} mt="6">
        <TabList>
          <Tab>Body</Tab>
          <Tab>Metadata</Tab>
          {mintAmount && <Tab>Mint</Tab>}
        </TabList>
        <TabPanels
          border={'1px'}
          borderColor="gray.700"
          borderBottomRightRadius={'md'}
          borderBottomLeftRadius={'md'}
          padding="3"
        >
          <TabPanel>
            <Flex gap={'3'}>
              <Box w={'50%'}>
                <Heading size="md" textAlign={'center'} my="4">
                  Inputs
                </Heading>
                {utxos.inputs.map(
                  ({
                    tx_hash: txHash,
                    output_index: outputIndex,
                    address,
                    amount,
                  }) => (
                    <TransactionInput
                      key={txHash + outputIndex}
                      address={address}
                      txHash={txHash}
                      txIndex={outputIndex}
                      amount={amount}
                    />
                  ),
                )}
              </Box>
              <Box w={'50%'}>
                <Heading size="md" textAlign={'center'} my="4">
                  Outputs
                </Heading>
                {utxos.outputs.map(
                  ({
                    output_index: outputIndex,
                    address,
                    amount,
                    data_hash: datumHash,
                  }) => (
                    <TransactionInput
                      key={outputIndex}
                      address={address}
                      txIndex={outputIndex}
                      amount={amount}
                      datumHash={datumHash}
                    />
                  ),
                )}
              </Box>
            </Flex>
          </TabPanel>
          <TabPanel>
            <Box
              backgroundColor={'gray.700'}
              padding="4"
              borderRadius={'md'}
              maxH={600}
              overflow={'auto'}
            >
              <Text as="pre" fontSize={'sm'}>
                {JSON.stringify(metadata, null, 2)}
              </Text>
            </Box>
          </TabPanel>
          {mintAmount && (
            <TabPanel>
              <TableContainer
                border={'1px'}
                borderColor="gray.700"
                borderRadius={'md'}
                mt="8"
                borderBottom={'none'}
              >
                <Table>
                  <Thead>
                    <Tr>
                      <Th>Policy ID</Th>
                      <Th>Asset name</Th>
                      <Th>Mint amount</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {mintAmount.map(({ quantity, unit }) => (
                      <Tr key={`${quantity}_${unit}`}>
                        <Td>
                          <Link href={`/tokenPolicy/${unit.slice(0, 56)}`} alt>
                            {unit.slice(0, 56)}
                          </Link>
                        </Td>
                        <Td>
                          <Link href={`/token/${unit}`}>
                            <Text as="code">{hex2a(unit.slice(56))}</Text>
                          </Link>
                        </Td>
                        <Td>
                          <Text as="code">
                            {BigInt(quantity).toLocaleString()}
                          </Text>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export { Transaction };
