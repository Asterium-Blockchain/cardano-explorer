import { Amount } from '@/types';
import { truncateString } from '@/utils/strings';
import { CloseIcon } from '@chakra-ui/icons';
import { Box, Flex, Text } from '@chakra-ui/react';

interface TxOutProps {
  address: string;
  amount: Amount;
  onRemove: () => void;
}

const TxOut: React.FC<TxOutProps> = ({ address, amount, onRemove }) => {
  const lovelace = amount.find((a) => a.unit === 'lovelace')?.quantity;
  const otherAssets = amount.filter((a) => a.unit !== 'lovelace');

  return (
    <Flex
      key={`${address}-${amount}`}
      backgroundColor={'gray.600'}
      borderRadius="md"
      p="4"
      my={'3'}
      alignItems="center"
    >
      <Box flexGrow={0.7}>
        <Text as={'code'} color="gray.400">
          {truncateString(address, 48, 'middle')}
        </Text>
        <br />
        <Text as="code" fontSize={'lg'}>
          {parseInt(lovelace || '0', 10) / 1000000} ADA{' '}
          {otherAssets.length > 0 && `+ ${otherAssets.length} tokens`}
        </Text>
      </Box>
      <CloseIcon
        onClick={onRemove}
        _hover={{ opacity: 0.6 }}
        cursor={'pointer'}
      />
    </Flex>
  );
};

export { TxOut };
