import useWallet from '@/hooks/useWallet';
import { hex2a } from '@/utils/strings';
import { DebounceInput } from 'react-debounce-input';
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from '@chakra-ui/react';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { FixedSizeList } from 'react-window';
import Fuse from 'fuse.js';
import { CheckIcon, SearchIcon } from '@chakra-ui/icons';

interface MultiAssetSelectorProps {
  buttonTitle: string;
}

const MultiAssetSelector: React.FC<MultiAssetSelectorProps> = ({
  buttonTitle,
}) => {
  const { balance } = useWallet();
  const [q, setQ] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);
  const [fuse, setFuse] = useState<
    undefined | Fuse<{ unit: string; quantity: string }>
  >();

  const convertedBalance = useMemo(() => {
    const sorted = balance?.sort();
    const converted = sorted?.map((a) => ({
      ...a,
      readableUnit: hex2a(a.unit.slice(56)),
      selected: false,
    }));
    return converted;
  }, [balance]);

  useEffect(() => {
    if (convertedBalance && !fuse) {
      const fuse = new Fuse(convertedBalance, {
        keys: ['unit', 'readableUnit'],
      });
      setFuse(fuse);
    }
  }, [convertedBalance, fuse]);

  useEffect(() => {
    if (fuse && q.length) {
      const results = fuse.search(q).map((r) => r.item);
      setResults(results);
    } else if (q.length === 0 && convertedBalance) {
      setResults(convertedBalance);
    }
  }, [q, fuse, convertedBalance]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQ(e.target.value);
  };

  const indexToggler = (index: number) => () => {
    const newResults = [...results];
    newResults[index].selected = !newResults[index].selected;
    setResults(newResults);
  };

  return (
    <>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color={'gray.400'} />
        </InputLeftElement>
        <Input
          onChange={handleChange}
          placeholder="Search assets"
          as={DebounceInput}
          debounceTimeout={200}
        />
      </InputGroup>
      <Box
        mt="3"
        border={'1px'}
        borderColor="gray.600"
        borderRadius={'md'}
        px="3"
      >
        {results.length ? (
          <FixedSizeList
            height={300}
            width={'100%'}
            itemCount={results.length}
            itemSize={50}
          >
            {({ index, style }) => {
              const { unit, quantity, readableUnit, selected } = results[index];
              return (
                <Box
                  key={unit}
                  style={style}
                  display="flex"
                  alignItems={'center'}
                  _hover={{ opacity: 0.6 }}
                  cursor="pointer"
                  transition={'200ms'}
                  onClick={indexToggler(index)}
                >
                  <CheckIcon
                    mr="2"
                    display={selected ? 'inline' : 'none'}
                    color="green.400"
                  />
                  {quantity} {readableUnit || hex2a(unit.slice(56))}
                </Box>
              );
            }}
          </FixedSizeList>
        ) : (
          <Box
            height={300}
            width="100%"
            display={'flex'}
            alignItems="center"
            justifyContent={'center'}
          >
            <Text color="gray.500">No results</Text>
          </Box>
        )}
      </Box>
    </>
  );
};
export { MultiAssetSelector };
