import useWallet from '@/hooks/useWallet';
import {
  Box,
  Center,
  Container,
  Heading,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import MetadataPanel from './components/MetadataPanel';
import TransactionBodyPanel from './components/TransactionBodyPanel';

const TransactionBuilder = () => {
  const { walletName, walletLoading } = useWallet();

  return (
    <Container maxW={'container.xl'} mt="12">
      <Heading size="md" mb="2">
        Transaction builder
      </Heading>
      <Text color={'gray.600'}>
        Build transactions without the need of interacting with dApps
      </Text>

      <Tabs mt={'5'} mb="12" variant={'enclosed'}>
        <TabList>
          <Tab>Body</Tab>
          <Tab>Metadata</Tab>
        </TabList>
        <TabPanels
          borderRadius="md"
          border="1px"
          borderColor={'gray.600'}
          borderTopLeftRadius="none"
          minH="60vh"
        >
          <TabPanel minH="60vh" display={'flex'}>
            <TransactionBodyPanel />
          </TabPanel>
          <TabPanel minH="60vh" display={'flex'} alignItems={'stretch'}>
            <MetadataPanel />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export { TransactionBuilder };
