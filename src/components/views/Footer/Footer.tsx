import {
  Box,
  Container,
  Icon,
  Link,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import Image from 'next/image';
import { GitHub, Twitter } from 'react-feather';
import ListHeader from './components/ListHeader';

const Footer = () => {
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
      marginTop="auto"
    >
      <Container as={Stack} maxW={'container.xl'} py={10}>
        <SimpleGrid
          templateColumns={{ sm: '1fr 1fr', md: '1fr 1fr' }}
          spacing={8}
        >
          <Stack spacing={3}>
            <Box display={'flex'} alignItems="center" gap="2">
              <Image
                src="/icons/asterium-logo.svg"
                width={25}
                height={25}
                alt="asterium-logo"
              />
              <Text fontSize={'lg'} fontWeight={600}>
                Asterium
              </Text>
            </Box>
            <Text fontSize={'sm'} color="gray.500">
              The Cardano community explorer and toolkit
            </Text>
          </Stack>
          <Stack align={'flex-end'} spacing={'3'}>
            <ListHeader>Follow Us</ListHeader>
            <Link
              href={'https://twitter.com/scheredev'}
              color={'gray.500'}
              display="flex"
              alignItems={'center'}
              gap="2"
            >
              <Icon as={Twitter} size="sm" />
              Twitter
            </Link>
            <Link
              href={'https://github.com/Asterium-Blockchain'}
              color={'gray.500'}
              display="flex"
              alignItems={'center'}
              gap="2"
            >
              <Icon as={GitHub} size="sm" />
              Github
            </Link>
          </Stack>
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export { Footer };
