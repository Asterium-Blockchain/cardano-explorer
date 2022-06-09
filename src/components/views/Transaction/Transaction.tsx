import blockfrost from '@lib/blockfrost';
import { Box, Container, Flex, Heading, Tag, Text } from '@chakra-ui/react';
import DetailsTable from './components/DetailsTable';
import { TransactionInput } from './components/TransactionInput/TransactionInput';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';

interface TransactionProps {
  transaction: Awaited<ReturnType<typeof blockfrost.txs>>;
  utxos: Awaited<ReturnType<typeof blockfrost.txsUtxos>>;
  metadata: Awaited<ReturnType<typeof blockfrost.txsMetadata>>;
}

const Transaction: React.FC<TransactionProps> = ({
  transaction,
  utxos,
  metadata,
}) => {
  return (
    <Container size={'container.xl'} py={'12'} maxW={'container.xl'}>
      <Flex>
        <Heading size={'md'} mr="2">
          Transaction
        </Heading>
        {utxos.inputs.find((i) => !!i.data_hash) && (
          <Tag size={'sm'} mt="1" colorScheme={'cyan'}>
            Consuming from a script
          </Tag>
        )}
        {utxos.outputs.find((o) => !!o.data_hash) && (
          <Tag size={'sm'} mt="1" colorScheme={'pink'}>
            Sending to a script
          </Tag>
        )}
      </Flex>

      <DetailsTable transaction={transaction} />

      <Tabs variant={'enclosed'} mt="6">
        <TabList>
          <Tab>Body</Tab>
          <Tab>Metadata</Tab>
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
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export { Transaction };
