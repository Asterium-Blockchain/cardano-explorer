import styles from './styles.module.scss';

import React from 'react';
import { Flex, theme, Box, Heading, Text } from '@chakra-ui/react';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';

interface SearchResultProps {
  title: string;
  subtitle: string;
  loading: boolean;
}

const SearchResult: React.FC<SearchResultProps> = ({
  title,
  loading,
  subtitle,
}) => {
  return (
    <Link href="/" passHref>
      <Flex
        className={styles.searchResult}
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
          <Skeleton baseColor={theme.colors.gray[100]} />
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
    </Link>
  );
};

export { SearchResult };
