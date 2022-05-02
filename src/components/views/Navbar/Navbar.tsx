import useStore from '@/store/useStore';
import { decodeType, getUrlFromType } from '@/utils/crypto/validation';
import { truncateString } from '@/utils/strings';
import { SearchIcon } from '@chakra-ui/icons';
import {
  Container,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Tag,
} from '@chakra-ui/react';
import { useClickAway } from 'ahooks';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { DebounceInput } from 'react-debounce-input';
import SearchResult from './components/SearchResult';

const Navbar = () => {
  const searchedVal = useStore((state) => state.searchedVal);
  const search = useStore((state) => state.search);
  const resetSearch = useStore((state) => state.resetSearch);
  const element = useStore((state) => state.element);
  const isLoadingSearch = useStore((state) => state.isLoadingSearch);
  const toggleShowSearchElement = useStore(
    (state) => state.toggleShowSearchElement,
  );
  const showSearchElement = useStore((state) => state.showSearchElement);
  const updateSearchVal = useStore((state) => state.updateSearchVal);

  const isLoadingAdaPrice = useStore((state) => state.isLoadingAdaPrice);
  const adaPrice = useStore((state) => state.adaPrice);
  const fetchAdaPrice = useStore((state) => state.fetchAdaPrice);

  const clickAwayRef = useRef<HTMLAnchorElement>(null);

  useClickAway(() => {
    toggleShowSearchElement();
  }, clickAwayRef);

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
        <Link href={'/'} passHref>
          <a>
            <Heading size={'md'}>ADAScan</Heading>
          </a>
        </Link>

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
            {showSearchElement &&
              (isLoadingSearch ||
                (element?.type && (
                  <SearchResult
                    url={getUrlFromType(element.type, searchedVal) || '#'}
                    loading={isLoadingSearch}
                    title={decodeType(element.type)}
                    subtitle={truncateString(searchedVal, 48, 'middle') || ''}
                    ref={clickAwayRef}
                  />
                )))}
          </InputGroup>
        </Flex>
        <Tag>ADA: ${isLoadingAdaPrice ? '.......' : adaPrice}</Tag>
      </Container>
    </Flex>
  );
};

export { Navbar };
