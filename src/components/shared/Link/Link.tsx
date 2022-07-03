import NextLink from 'next/link';
import { Text, TextProps } from '@chakra-ui/react';

interface LinkProps {
  href: string;
  alt?: boolean;
  children: React.ReactNode;
}

const Link: React.FC<LinkProps & TextProps> = ({
  children,
  href,
  alt = false,
  ...rest
}) => {
  return (
    <NextLink href={href} passHref>
      <a>
        <Text
          color={alt ? undefined : 'purple.400'}
          cursor={'pointer'}
          _hover={{ textDecor: 'underline' }}
          display="inline"
          {...rest}
        >
          {children}
        </Text>
      </a>
    </NextLink>
  );
};

export { Link };
