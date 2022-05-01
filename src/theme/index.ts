import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  useSystemColorMode: false,
  initialColorMode: 'dark',
};

const theme = extendTheme({
  config,
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
});

export default theme;
