import useStore from '@/store/useStore';
import { randomID } from '@/utils/strings';
import { CloseIcon, SmallAddIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Input, Text } from '@chakra-ui/react';
import { ChangeEvent, useEffect, useState } from 'react';

const MetadataPanel = () => {
  const setMetadata = useStore((state) => state.setMetadata);
  const metadata = useStore((state) => state.metadata);

  const [keyValues, setKeyValues] = useState<
    Record<string, { key: string; value: string; id: string }>
  >({
    '0': {
      key: '',
      value: '',
      id: '0',
    },
  });

  const addKeyValue = () => {
    const randomId = randomID();
    setKeyValues((prev) => ({
      ...prev,
      [randomId]: { key: '', value: '', id: randomId },
    }));
  };

  const handleChangeKey =
    (id: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setKeyValues((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          key: e.target.value,
        },
      }));
    };

  const handleChangeValue =
    (id: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setKeyValues((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          value: e.target.value,
        },
      }));
    };

  const handleRemoveKeyValue = (id: string) => () => {
    const newKeyValues = { ...keyValues };
    delete newKeyValues[id];
    setKeyValues(newKeyValues);
  };

  useEffect(() => {
    const newMetadata = Object.entries(keyValues)
      .filter(([, e]) => e.key.length)
      .reduce((acc, [, curr]) => ({ ...acc, [curr.key]: curr.value }), {});

    if (newMetadata) {
      setMetadata(newMetadata);
    }
  }, [keyValues, setMetadata]);

  return (
    <Flex gap="4" flexGrow={1} alignItems="stretch">
      <Box w="50%" p="3">
        {Object.entries(keyValues).map(([, { id }]) => (
          <Flex key={id} width="100%" my={2} gap="2" alignItems={'center'}>
            <Input
              w="45%"
              placeholder="Key"
              onChange={handleChangeKey(id)}
              maxLength={64}
            />
            <Input
              w="45%"
              placeholder="Value"
              onChange={handleChangeValue(id)}
              maxLength={64}
            />
            <CloseIcon
              onClick={handleRemoveKeyValue(id)}
              marginLeft="2"
              _hover={{ opacity: 0.6 }}
              cursor="pointer"
            />
          </Flex>
        ))}
        <Button
          variant={'outline'}
          rightIcon={<SmallAddIcon />}
          size="sm"
          onClick={addKeyValue}
          mt="2"
          mx="auto"
        >
          Add key/value pair
        </Button>
      </Box>
      <Box
        bg={'gray.600'}
        w="50%"
        borderRadius={'md'}
        p="4"
        overflowX={'scroll'}
      >
        {metadata && Object.keys(metadata).length ? (
          <Text as="pre">{JSON.stringify(metadata, null, 2)}</Text>
        ) : (
          <Text as="code">
            Metadata empty. Start adding keys and values to see the preview
            here.
          </Text>
        )}
      </Box>
    </Flex>
  );
};

export { MetadataPanel };
