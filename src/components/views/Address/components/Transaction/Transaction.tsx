import { Box, Text } from '@chakra-ui/react';
import { tx } from '@prisma/client';
import Link from 'next/link';

interface TransactionProps {
  transaction: tx;
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
