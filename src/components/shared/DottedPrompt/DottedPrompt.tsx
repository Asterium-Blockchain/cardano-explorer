import { Box, Text } from '@chakra-ui/react';

interface DottedPromptProps {
  onClick: () => void;
}

const DottedPrompt: React.FC<DottedPromptProps> = ({ onClick, children }) => {
  return (
    <Box
      borderStyle={'dotted'}
      px="2"
      py="6"
      borderColor={'gray.600'}
      borderWidth="1px"
      my={'2'}
      borderRadius={'md'}
      cursor={'pointer'}
      _hover={{ opacity: 0.8 }}
      onClick={onClick}
    >
      <Text textAlign={'center'}>{children}</Text>
    </Box>
  );
};
export { DottedPrompt };
