import useStore from '@/store/useStore';
import { decodeType } from '@/utils/crypto/validation';
import { truncateString } from '@/utils/strings';
import { SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  Container,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Tag,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { DebounceInput } from 'react-debounce-input';
import SearchResult from './components/SearchResult';

const Navbar = () => {
  // Search
  const searchedVal = useStore((state) => state.searchedVal);
  const search = useStore((state) => state.search);
  const resetSearch = useStore((state) => state.resetSearch);
  const element = useStore((state) => state.element);
  const isLoadingSearch = useStore((state) => state.isLoadingSearch);
  const updateSearchVal = useStore((state) => state.updateSearchVal);

  const isLoadingAdaPrice = useStore((state) => state.isLoadingAdaPrice);
  const adaPrice = useStore((state) => state.adaPrice);
  const fetchAdaPrice = useStore((state) => state.fetchAdaPrice);

  useEffect(() => {
    if (searchedVal.length) {
      search();
    } else {
      resetSearch();
    }
  }, [searchedVal, search, resetSearch]);

  useEffect(() => {
    fetchAdaPrice();
  }, [fetchAdaPrice]);

  return (
    <Flex borderBottom={'1px'} borderBottomColor="gray.700">
      <Container
        maxW="container.xl"
        paddingY={'5'}
        alignItems="center"
        display={'flex'}
        justifyContent="space-between"
      >
        <Heading size={'md'}>ADAScan</Heading>

        <Flex alignItems={'center'} gap={'1'} position="relative">
          <InputGroup>
            <InputLeftElement
              color={'gray.500'}
              pointerEvents="none"
              height={'100%'}
            >
              <SearchIcon color={'gray.300'} />
            </InputLeftElement>
            <Input
              placeholder="Enter policy ID, asset ID or transaction hash"
              size={'lg'}
              width={'xl'}
              as={DebounceInput}
              debounceTimeout={200}
              minLength={2}
              variant="filled"
              onChange={updateSearchVal}
            />
            {isLoadingSearch ||
              (element?.type && (
                <SearchResult
                  loading={isLoadingSearch}
                  title={decodeType(element.type)}
                  subtitle={truncateString(searchedVal, 48, 'middle') || ''}
                />
              ))}
          </InputGroup>
        </Flex>
        <Tag>ADA: ${isLoadingAdaPrice ? '...' : adaPrice}</Tag>
      </Container>
    </Flex>
  );
};

export { Navbar };
