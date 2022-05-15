import useStore from '@/store/useStore';
import { CheckCircleIcon } from '@chakra-ui/icons';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  useClipboard,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';

const SuccessModal: React.FC = () => {
  const txHash = useStore((state) => state.txHash);
  const reset = useStore((state) => state.resetBuilder);

  const { hasCopied, onCopy } = useClipboard(txHash || '');

  const { onClose } = useDisclosure();

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={!!txHash} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <CheckCircleIcon color={'green.400'} mr="1" mb="1" /> Success
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb="4">
          Your transaction was successfully submitted. Here&apos;s the hash:
          <InputGroup mt="5">
            <Input value={txHash || ''} variant="filled" />
            <InputRightElement w="4rem">
              <Button h="1.75rem" size="sm" onClick={onCopy} mr="2">
                {hasCopied ? 'Copied!' : 'Copy'}
              </Button>
            </InputRightElement>
          </InputGroup>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export { SuccessModal };
