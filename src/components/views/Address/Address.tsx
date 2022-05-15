import {
  Button,
  Center,
  Container,
  Flex,
  Heading,
  Tag,
} from '@chakra-ui/react';

import { AddressPageProps } from '@/pages/address/[address]';
import useStore from '@/store/useStore';
import DetailsTable from './components/DetailsTable';
import Transaction from './components/Transaction';
import { useMemo } from 'react';

const Address: React.FC<AddressPageProps> = ({
  transactions,
  hasMore,
  addressData,
}) => {
  const {
    lovelaceBalance,
    isScript,
    tokenCount,
    stakeAddress,
    adaHandle,
    address,
  } = addressData;

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
        {isScript && (
          <Tag size={'sm'} mt="1" colorScheme={'pink'}>
            Script
          </Tag>
        )}
      </Flex>

      <DetailsTable
        address={address}
        balance={lovelaceBalance}
        stakeKey={stakeAddress}
        tokenCount={tokenCount}
        adaHandle={adaHandle}
      />

      <Heading size="md" mt="8" mb="6">
        Transactions
      </Heading>

      {allTransactions.map((transaction) => (
        <Transaction key={transaction.tx_hash} transaction={transaction} />
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
