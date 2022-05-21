import blockfrost from '@lib/blockfrost';
import { Box, Container, Flex, Heading, Tag } from '@chakra-ui/react';
import DetailsTable from './components/DetailsTable';
import { TransactionInput } from './components/TransactionInput/TransactionInput';

interface TransactionProps {
  transaction: Awaited<ReturnType<typeof blockfrost.txs>>;
  utxos: Awaited<ReturnType<typeof blockfrost.txsUtxos>>;
}

const Transaction: React.FC<TransactionProps> = ({ transaction, utxos }) => {
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

      <Flex gap={'3'} mt="6">
        <Box flexGrow={1}>
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
        <Box flexGrow={1}>
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
    </Container>
  );
};

export { Transaction };
