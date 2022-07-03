import { Center, Container, Flex, Heading, Icon, Tag } from '@chakra-ui/react';

import {
  Pagination,
  usePagination,
  PaginationPage,
  PaginationNext,
  PaginationPrevious,
  PaginationPageGroup,
  PaginationContainer,
} from '@ajna/pagination';

import { AddressPageProps } from '@/pages/address/[address]';
import DetailsTable from './components/DetailsTable';
import Transaction from './components/Transaction';
import { useEffect, useState } from 'react';
import { PAGE_SIZE } from '@/constants';
import axios from '@/utils/axios';
import { ChevronLeft, ChevronRight } from 'react-feather';

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

  const { pages, pagesCount, currentPage, setCurrentPage, isDisabled } =
    usePagination({
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
          page: currentPage,
        },
      })
      .then(({ data }) => setTransactions(data));
  }, [currentPage, address]);

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
        adaHandles={adaHandles}
        utxoCount={utxoCount}
      />

      <Heading size="md" mt="8" mb="6">
        Transactions
      </Heading>

      {transactions.map((transaction) => (
        <Transaction key={transaction.tx_hash} transaction={transaction} />
      ))}

      {transactions.length < transactionCount && (
        <Center mt="4">
          <Pagination
            currentPage={currentPage}
            pagesCount={pagesCount}
            onPageChange={setCurrentPage}
            isDisabled={isDisabled}
          >
            <PaginationContainer>
              <PaginationPrevious mr="3">
                <Icon as={ChevronLeft} />
              </PaginationPrevious>
              <PaginationPageGroup>
                {pages.map((page) => (
                  <PaginationPage
                    key={`p_${page}`}
                    page={page}
                    isActive={currentPage === page}
                    px="3"
                  />
                ))}
              </PaginationPageGroup>
              <PaginationNext ml="3">
                <Icon as={ChevronRight} />
              </PaginationNext>
            </PaginationContainer>
          </Pagination>
        </Center>
      )}
    </Container>
  );
};

export default Address;
