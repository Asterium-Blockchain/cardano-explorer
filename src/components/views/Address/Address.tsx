import { ADA_HANDLE_POLICY_ID } from '@/constants';
import blockfrost from '@/utils/blockchain/blockfrost';
import { hex2a } from '@/utils/strings';
import { Container, Flex, Heading, Tag } from '@chakra-ui/react';
import DetailsTable from './components/DetailsTable';
import Transaction from './components/Transaction';

interface AddressProps {
  addressData: Awaited<ReturnType<typeof blockfrost.addressesExtended>>;
  transactions: Awaited<ReturnType<typeof blockfrost.addressesTransactions>>;
  adaHandle?: string;
}

const Address: React.FC<AddressProps> = ({ addressData, transactions }) => {
  const { script, address, amount, stake_address: stakeAddress } = addressData;

  const balance = amount.find((a) => a.unit === 'lovelace')?.quantity || '0';
  const tokenCount = amount.filter((a) => a.unit !== 'lovelace').length;
  const encodedAdaHandle = amount
    .find((a) => a.unit.slice(0, 56) === ADA_HANDLE_POLICY_ID)
    ?.unit.slice(56);
  const adaHandle = encodedAdaHandle ? hex2a(encodedAdaHandle) : undefined;

  return (
    <Container maxW={'container.xl'} py="12">
      <Flex>
        <Heading size="md" mr="2">
          Address
        </Heading>
        {script && (
          <Tag size={'sm'} mt="1" colorScheme={'pink'}>
            Script
          </Tag>
        )}
      </Flex>

      <DetailsTable
        address={address}
        balance={balance}
        stakeKey={stakeAddress}
        tokenCount={tokenCount}
        adaHandle={adaHandle}
      />

      <Heading size="md" mt="8" mb="6">
        Transactions
      </Heading>

      {transactions.map(({ tx_hash: txHash }) => (
        <Transaction key={txHash} />
      ))}
    </Container>
  );
};

export default Address;
