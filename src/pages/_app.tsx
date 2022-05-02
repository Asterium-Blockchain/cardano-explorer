import '@fontsource/inter';

import { AppProps } from 'next/app';
import { ChakraProvider, Flex } from '@chakra-ui/react';
import NextNProgress from 'nextjs-progressbar';

import theme from '@/theme';
import Navbar from '@/components/views/Navbar';
import Footer from '@/components/views/Footer';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <NextNProgress height={2} color={theme.colors.gray['200']} />
      <Flex direction={'column'} minH="100vh">
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </Flex>
    </ChakraProvider>
  );
}
