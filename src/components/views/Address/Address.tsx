import {
  Button,
  Center,
  Container,
  Flex,
  Heading,
  Tag,
} from '@chakra-ui/react';
import { toHex } from 'lucid-cardano';

import { ADA_HANDLE_POLICY_ID } from '@/constants';
import { AddressPageProps } from '@/pages/address/[address]';
import useStore from '@/store/useStore';
import { hex2a } from '@/utils/strings';
import DetailsTable from './components/DetailsTable';
import Transaction from './components/Transaction';
import { useMemo } from 'react';

const Address: React.FC<AddressPageProps> = ({
  addressData,
  transactions,
  hasMore,
}) => {
  const { script, address, amount, stake_address: stakeAddress } = addressData;

  const balance = amount.find((a) => a.unit === 'lovelace')?.quantity || '0';
  const tokenCount = amount.filter((a) => a.unit !== 'lovelace').length;
  const encodedAdaHandle = amount
    .find((a) => a.unit.slice(0, 56) === ADA_HANDLE_POLICY_ID)
    ?.unit.slice(56);
  const adaHandle = encodedAdaHandle ? hex2a(encodedAdaHandle) : undefined;

  const addressTransactions = useStore((state) => state.addressTransactions);
  const isLoadingFetchMore = useStore(
    (state) => state.isLoadingFetchMoreAddressTransactions,
  );
  const fetchMore = useStore((state) => state.fetchMoreAddressTransactions);
  const fetchMoreWithAddress = () => fetchMore(address);

  const allTransactions = useMemo(() => {
    return [...transactions, ...addressTransactions];
  }, [addressTransactions, transactions]);

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

      {allTransactions.map((transaction) => (
        <Transaction key={toHex(transaction.hash)} transaction={transaction} />
      ))}

      {hasMore && (
        <Center mt={10}>
          <Button
            variant={'outline'}
            onClick={fetchMoreWithAddress}
            isLoading={isLoadingFetchMore}
          >
            Fetch more
          </Button>
        </Center>
      )}
    </Container>
  );
};

export default Address;
