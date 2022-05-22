import NextLink from 'next/link';
import { Text, TextProps } from '@chakra-ui/react';

interface LinkProps {
  href: string;
  children: React.ReactNode;
}

const Link: React.FC<LinkProps & TextProps> = ({ children, href, ...rest }) => {
  return (
    <NextLink href={href} passHref>
      <a>
        <Text
          color="purple.400"
          cursor={'pointer'}
          _hover={{ textDecor: 'underline' }}
          {...rest}
        >
          {children}
        </Text>
      </a>
    </NextLink>
  );
};

export { Link };
