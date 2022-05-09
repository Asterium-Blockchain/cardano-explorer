import { AddressTransactionsResponse } from '@/pages/api/addresses/[address]/transactions';
import { Box, Text } from '@chakra-ui/react';
import Link from 'next/link';

interface TransactionProps {
  transaction: AddressTransactionsResponse['transactions'][0];
}

const Transaction: React.FC<TransactionProps> = ({ transaction }) => {
  const { hash } = transaction;
  return (
    <Box bgColor={'gray.700'} borderRadius="md" p={'5'} my="3">
      <Link href={`/transaction/${hash}`}>
        <a>
          <Text
            as="code"
            color={'purple.400'}
            _hover={{ color: 'purple.300' }}
            transition={'200ms'}
          >
            {hash}
          </Text>
        </a>
      </Link>
    </Box>
  );
};

export { Transaction };
