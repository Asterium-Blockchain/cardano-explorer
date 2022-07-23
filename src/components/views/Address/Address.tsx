import { Center, Container, Flex, Heading, Tag } from '@chakra-ui/react';
import { Badge, Text } from '@chakra-ui/react';

import { AddressPageProps } from '@/pages/address/[address]';
import Transaction from './components/Transaction';
import { useEffect, useState } from 'react';
import { PAGE_SIZE } from '@/constants';
import axios from '@/utils/axios';
import Paginator from '@/components/shared/Paginator';
import { usePagination } from '@ajna/pagination';
import DetailsTable from '@/components/shared/DetailsTable';
import { toADA } from '@/utils/crypto';

const Address: React.FC<AddressPageProps> = ({
  transactions: _transactions,
  transactionCount,
  addressData,
}) => {
  const {
    lovelaceBalance,
    isScript,
    tokenCount,
    stakeAddress,
    adaHandles,
    address,
    utxoCount,
  } = addressData;

  const [transactions, setTransactions] = useState(_transactions);

  const pagination = usePagination({
    total: transactionCount,
    limits: {
      outer: 2,
      inner: 2,
    },
    initialState: {
      pageSize: PAGE_SIZE,
      isDisabled: false,
      currentPage: 1,
    },
  });

  useEffect(() => {
    axios
      .get(`address/${address}/transactions`, {
        params: {
          page: pagination.currentPage,
        },
      })
      .then(({ data }) => setTransactions(data));
  }, [pagination.currentPage, address]);

  const rows = [
    { key: 'address', header: 'Bech32', value: address },
    {
      key: 'stakeKey',
      header: 'Stake Key',
      value: stakeAddress,
    },
    {
      key: 'balance',
      header: 'Balance',
      value: lovelaceBalance,
      isAda: true,
    },
    {
      key: 'nativeTokens',
      header: `Native token${tokenCount !== 1 && 's'}`,
      value: tokenCount.toLocaleString(),
    },
    { key: 'utxos', header: 'UTxOs', value: utxoCount.toLocaleString() },
    {
      key: 'adaHandles',
      header: 'Ada Handles',
      hide: adaHandles.length === 0,
      render: () => (
        <>
          {adaHandles.map((handle) => (
            <Badge as="code" colorScheme={'orange'} key={handle} ml="2">
              ${handle}
            </Badge>
          ))}
        </>
      ),
    },
  ];

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

      <DetailsTable rows={rows} />

      <Heading size="md" mt="8" mb="6">
        Transactions
      </Heading>

      {transactions.map((transaction) => (
        <Transaction key={transaction.tx_hash} transaction={transaction} />
      ))}

      {transactions.length < transactionCount && (
        <Center mt="4">
          <Paginator {...pagination} />
        </Center>
      )}
    </Container>
  );
};

export default Address;
