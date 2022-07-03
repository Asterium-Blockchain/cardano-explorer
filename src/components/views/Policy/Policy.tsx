import { PolicyPageProps } from '@/pages/tokenPolicy/[policyId]';
import {
  Container,
  Heading,
  Tab,
  Table,
  TableContainer,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Th,
  Tr,
} from '@chakra-ui/react';
import { AssetCard } from './components/AssetCard/AssetCard';

const Policy: React.FC<PolicyPageProps> = ({
  tokenCount,
  assets,
  holdersCount,
}) => {
  return (
    <Container py="12" maxW={'container.xl'}>
      <Heading size={'md'} mr="2">
        Policy
      </Heading>
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
              <Th>Token count</Th>
              <Td>{tokenCount}</Td>
            </Tr>
            <Tr>
              <Th>Holders count</Th>
              <Td>{holdersCount}</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
      <Tabs variant={'enclosed'} mt="6">
        <TabList>
          <Tab>Assets</Tab>
          <Tab>Holders</Tab>
        </TabList>

        <TabPanels
          border={'1px'}
          borderColor="gray.700"
          borderBottomRightRadius={'md'}
          borderBottomLeftRadius={'md'}
          padding="3"
        >
          <TabPanel>
            {assets.map((a) => (
              <AssetCard asset={a} key={a.fingerprint} />
            ))}
          </TabPanel>
          <TabPanel></TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export { Policy };
