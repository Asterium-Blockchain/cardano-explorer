import styles from './styles.module.scss';

import React from 'react';
import { Flex, theme, Box, Heading, Text, Skeleton } from '@chakra-ui/react';
import Link from 'next/link';

interface SearchResultProps {
  title: string;
  subtitle: string;
  loading: boolean;
  url: string;
}

const SearchResult = React.forwardRef<HTMLAnchorElement, SearchResultProps>(
  (props, ref) => {
    const { title, loading, subtitle, url } = props;

    return (
      <Link href={url} passHref>
        <a ref={ref} className={styles.searchResult}>
          <Flex
            bgColor="gray.700"
            px={'6'}
            as="a"
            py="6"
            width={'100%'}
            borderRadius="md"
            flexDir={'column'}
            boxShadow={'md'}
            transitionDuration={'0.2s'}
            cursor={'pointer'}
            _hover={{ bgColor: 'gray.600' }}
          >
            {loading ? (
              <Skeleton />
            ) : (
              <Box as={'a'}>
                <Heading as={'h3'} size="md">
                  {title}
                </Heading>
                <Text color={'gray.400'} mt="2">
                  {subtitle}
                </Text>
              </Box>
            )}
          </Flex>
        </a>
      </Link>
    );
  },
);

SearchResult.displayName = 'SearchResult';

export { SearchResult };
