import { AddressPageProps } from '@/pages/address/[address]';
import { Box, Text } from '@chakra-ui/react';
import moment from 'moment';
import Link from 'next/link';

interface TransactionProps {
  transaction: AddressPageProps['transactions'][0];
}

const Transaction: React.FC<TransactionProps> = ({ transaction }) => {
  const { hash, timestamp } = transaction;
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
      <Text color={'gray.500'}>
        {moment(new Date(timestamp)).format('YYYY/MM/DD HH:mm:ss')}
      </Text>
    </Box>
  );
};

export { Transaction };
