import { Center, Heading } from '@chakra-ui/react';

const NotFoundPage = () => {
  return (
    <Center width={'100%'} height="72.5vh" flexDir={'column'} gap="2">
      <Heading size={'3xl'} textAlign="center">
        404
      </Heading>
      <Heading size={'sm'} color="gray.500">
        Page not found
      </Heading>
    </Center>
  );
};

export default NotFoundPage;
