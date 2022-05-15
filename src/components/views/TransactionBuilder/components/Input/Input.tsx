import { Box } from '@chakra-ui/react';

interface InputProps {
  txHash?: string;
  txIndex?: number;
}

const Input = () => {
  return <Box backgroundColor={'gray.600'} p="4" borderRadius={'md'}></Box>;
};

export { Input };
