import useWallet from '@/hooks/useWallet';
import useStore from '@/store/useStore';
import {
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  Spinner,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import AddMenu from '../AddMenu';
import SuccessModal from '../SuccessModal';
import TxOut from '../TxOut';
import BUILDER_FEEDBACK_CONSTANTS from './feedback-constants';

const TransactionBodyPanel = () => {
  const { walletLoading, walletName } = useWallet();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const inputs = useStore((state) => state.inputs);
  const outputs = useStore((state) => state.outputs);
  const fee = useStore((state) => state.fee);

  const removeInput = useStore((state) => state.removeInput);
  const removeOutput = useStore((state) => state.removeOutput);

  const builderError = useStore((state) => state.builderError);
  const isBuilding = useStore((state) => state.isBuilding);

  const buildTransaction = useStore((state) => state.buildTransaction);
  const signTransaction = useStore((state) => state.signTransaction);

  const [modalPurpose, setModalPurpose] = useState<
    'ADD_OUTPUT' | 'ADD_INPUT' | undefined
  >();

  const btnRef = useRef<null | HTMLButtonElement>(null);

  const inputRemover = (index: number) => () => {
    removeInput(index);
  };
  const outputRemover = (index: number) => () => {
    removeOutput(index);
  };

  const openModal = (purpose: 'ADD_INPUT' | 'ADD_OUTPUT') => () => {
    setModalPurpose(purpose);
    onOpen();
  };

  useEffect(() => {
    if (walletName) {
      buildTransaction(walletName);
    }
  }, [inputs, outputs, walletName, buildTransaction]);

  const isBuildDisabled = useMemo(() => {
    return !!(
      walletLoading ||
      !walletName ||
      isBuilding ||
      builderError ||
      (!inputs.length && !outputs.length)
    );
  }, [builderError, isBuilding, walletLoading, walletName, inputs, outputs]);

  return (
    <>
      {walletLoading && <Spinner m="auto" />}

      {walletName && !walletLoading && (
        <Grid
          gap={'4'}
          flexGrow={1}
          templateRows="repeat(6, 1fr)"
          templateColumns="repeat(2, 1fr)"
        >
          <GridItem colStart={0} colEnd={2} rowStart={1} rowEnd={6}>
            <Heading size={'md'} mt="2" textAlign={'center'}>
              Inputs
            </Heading>
            <Box mt="6">
              <Box bg="gray.600" borderRadius={'md'} px="4" py="2">
                <Text color={'gray.400'}>
                  Default Wallet UTxOs to cover outputs
                </Text>
              </Box>
            </Box>
            <Box
              borderStyle={'dotted'}
              px="2"
              py="6"
              borderColor={'gray.600'}
              borderWidth="1px"
              my={'2'}
              borderRadius={'md'}
              cursor={'pointer'}
              _hover={{ opacity: 0.8 }}
              onClick={openModal('ADD_INPUT')}
            >
              <Text textAlign={'center'}>+ Add script input</Text>
            </Box>
          </GridItem>
          <GridItem colStart={2} colEnd={4} rowStart={1} rowEnd={6}>
            <Heading size={'md'} mt="2" textAlign={'center'}>
              Outputs
            </Heading>
            <Box mt="6" maxH={'60vh'} overflowY="auto">
              {outputs.map(({ address, amount }, index) => (
                <TxOut
                  key={`${address}-${amount}`}
                  address={address}
                  amount={amount}
                  onRemove={outputRemover(index)}
                />
              ))}
              <Box
                borderStyle={'dotted'}
                px="2"
                py="6"
                borderColor={'gray.600'}
                borderWidth="1px"
                my={'2'}
                borderRadius={'md'}
                cursor={'pointer'}
                _hover={{ opacity: 0.8 }}
                onClick={openModal('ADD_OUTPUT')}
              >
                <Text textAlign={'center'}>+ Add output</Text>
              </Box>
            </Box>
          </GridItem>
          <GridItem
            colSpan={4}
            borderTop="1px"
            borderColor={'gray.600'}
            display={'flex'}
            alignItems="center"
          >
            <Text color={'gray.400'}>
              Network fees:{' '}
              {fee ? (
                <Text
                  display={'inline'}
                  fontSize="lg"
                  as="code"
                  color="white"
                  ml="2"
                >
                  {parseInt(fee, 10) / 1000000} ADA
                </Text>
              ) : (
                <Text color="gray.600" display={'inline'} ml="2">
                  Not calculated
                </Text>
              )}
            </Text>
            <Button
              ml={'auto'}
              variant="solid"
              colorScheme={builderError ? 'red' : 'green'}
              px="12"
              onClick={signTransaction}
              disabled={isBuildDisabled}
              isLoading={isBuilding}
            >
              {builderError
                ? BUILDER_FEEDBACK_CONSTANTS[builderError]
                : 'Build'}
            </Button>
          </GridItem>
        </Grid>
      )}

      <AddMenu
        finalFocusRef={btnRef}
        isOpen={isOpen}
        onClose={onClose}
        purpose={modalPurpose}
      />

      <SuccessModal />

      {!walletLoading && !walletName && (
        <Text m="auto" fontSize={'md'} color="gray.500">
          Connect wallet to start
        </Text>
      )}
    </>
  );
};

export { TransactionBodyPanel };
