import Image from '@/components/shared/Image';
import Link from '@/components/shared/Link';
import { AssetPageProps } from '@/pages/token/[assetId]';
import { getImageUrl } from '@/utils/blockchain/images';
import { hex2a } from '@/utils/strings';
import { CheckIcon, CopyIcon } from '@chakra-ui/icons';
import {
  Container,
  Flex,
  Heading,
  Icon,
  Tab,
  Table,
  TableContainer,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Tr,
  useClipboard,
} from '@chakra-ui/react';
import moment from 'moment';

const Asset: React.FC<AssetPageProps> = ({ asset, mintTx }) => {
  const {
    onchain_metadata: onchainMetadata,
    fingerprint,
    asset_name: assetName,
    initial_mint_tx_hash: mintTxHash,
    quantity,
  } = asset;

  const { hasCopied, onCopy } = useClipboard(fingerprint);

  const isCollectible = typeof onchainMetadata?.image === 'string';

  return (
    <Container maxW={'container.xl'} mt="12">
      <Flex gap="6" alignItems={'center'}>
        {isCollectible && (
          <Image
            src={getImageUrl(onchainMetadata.image as any)}
            alt="Token image"
            width={300}
            height={325}
          />
        )}
        <Flex flexDir={'column'} justifyContent="flex-start">
          <Flex>
            {quantity === '1' && (
              <Tag
                colorScheme={'cyan'}
                w="min-content"
                mr="2"
                whiteSpace={'nowrap'}
              >
                NFT
              </Tag>
            )}
            {isCollectible && (
              <Tag colorScheme={'purple'} w="min-content" mr="2">
                Collectible
              </Tag>
            )}
          </Flex>
          <Heading fontSize={'3xl'} my="2">
            {onchainMetadata?.name || hex2a(assetName || '')}
          </Heading>
          <Text
            color={'gray.400'}
            _hover={{ textDecor: 'underline', cursor: 'pointer' }}
            onClick={onCopy}
          >
            {hasCopied ? (
              <Icon as={CheckIcon} mr="2" />
            ) : (
              <Icon as={CopyIcon} mr="2" />
            )}
            {fingerprint}
          </Text>
          <TableContainer
            mt="8"
            border={'1px'}
            borderRadius={'md'}
            borderColor="gray.700"
            borderBottom={'none'}
          >
            <Table>
              <Tbody>
                <Tr>
                  <Th>Supply</Th>
                  <Td>{quantity}</Td>
                </Tr>
                <Tr>
                  <Th>Asset name</Th>
                  <Td>
                    {hex2a(assetName || '')}{' '}
                    <Text as="small">(hex: {assetName})</Text>
                  </Td>
                </Tr>
                <Tr>
                  <Th>Created at</Th>
                  <Td>
                    <Text color="gray.400">
                      {moment(mintTx.block_time * 1000).format(
                        'YYYY-MM-DD HH:mm:ss',
                      )}
                    </Text>
                  </Td>
                </Tr>
                <Tr>
                  <Th>Mint transaction</Th>
                  <Td>
                    <Link href={`/transaction/${mintTxHash}`} as="code">
                      {mintTxHash}
                    </Link>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </Flex>
      </Flex>
      <Tabs variant={'enclosed'} mt="12">
        <TabList>
          <Tab>Transaction history</Tab>
          <Tab>Onchain metadata</Tab>
          <Tab>Mint & Burn</Tab>
        </TabList>
        <TabPanels>
          <TabPanel></TabPanel>
          <TabPanel>
            {onchainMetadata ? (
              <TableContainer
                border={'1px'}
                borderRadius={'md'}
                borderColor="gray.700"
                borderBottom={'none'}
                mt="2"
                mb="8"
              >
                <Table>
                  <Tbody>
                    {Object.entries(onchainMetadata).map(([key, value]) => (
                      <Tr key={key}>
                        <Th>{key}</Th>
                        <Td>
                          {typeof value === 'string'
                            ? value
                            : JSON.stringify(value)}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <Text color="gray.600" p="16" textAlign={'center'}>
                No onchain metadata was found for this asset
              </Text>
            )}
          </TabPanel>
          <TabPanel></TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export { Asset };
