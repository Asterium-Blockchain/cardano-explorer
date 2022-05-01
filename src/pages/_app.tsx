import '@fontsource/inter';

import { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';

import theme from '@/theme';
import Navbar from '@/components/views/Navbar';
import Footer from '@/components/views/Footer';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </ChakraProvider>
  );
}
