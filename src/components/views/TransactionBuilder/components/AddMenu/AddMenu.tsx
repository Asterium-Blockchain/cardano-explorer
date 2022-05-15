import useWallet from '@/hooks/useWallet';
import useStore from '@/store/useStore';
import { hex2a } from '@/utils/strings';
import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormErrorMessage,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react';
import { Field, Formik } from 'formik';
import MultiAssetSelector from '../MultiAssetSelector';
import MENU_CONSTANTS, { Prompt } from './menu-constants';

export type MenuPurpose = 'ADD_OUTPUT' | 'ADD_INPUT';

interface AddMenuProps {
  isOpen: boolean;
  onClose: () => void;
  finalFocusRef: React.RefObject<HTMLButtonElement>;
  purpose?: MenuPurpose;
}

const AddMenu: React.FC<AddMenuProps> = ({ purpose, onClose, ...rest }) => {
  const addInput = useStore((state) => state.addInput);
  const addOutput = useStore((state) => state.addOutput);
  if (!purpose) {
    return null;
  }

  const { title, prompts } = MENU_CONSTANTS[purpose];
  const formInitialValues: Record<Prompt['initialValue'], any> = prompts.reduce(
    (acc, prompt) => ({ ...acc, [prompt.name]: prompt.initialValue }),
    {},
  );

  const handleSubmit = (values: Record<string, any>) => {
    if (purpose === 'ADD_INPUT') {
      addInput({ txHash: values.txHash, txIndex: values.txIndex });
    }
    if (purpose === 'ADD_OUTPUT') {
      addOutput({
        address: values.address,
        amount: [
          {
            unit: 'lovelace',
            quantity: (values.adaAmount * 1000000).toString(),
          },
        ],
      });
    }
    onClose();
  };

  return (
    <Drawer placement="right" onClose={onClose} {...rest} size="md">
      <DrawerOverlay />

      <DrawerContent>
        <Formik initialValues={formInitialValues} onSubmit={handleSubmit}>
          {({ handleSubmit, errors, touched }) => (
            <Box
              onSubmit={handleSubmit}
              as="form"
              h="100%"
              display={'flex'}
              flexDir="column"
            >
              <DrawerCloseButton />
              <DrawerHeader>{title}</DrawerHeader>

              <DrawerBody overflow={'hidden'}>
                {prompts.map(
                  ({ type, placeholder, validate, name, selectFrom }, idx) => (
                    <FormControl
                      key={idx}
                      isInvalid={!!errors[name] && !!touched[name]}
                      mt={'3'}
                    >
                      {type === 'number' && (
                        <Field validate={validate} name={name}>
                          {({ field, form }: any) => (
                            <NumberInput
                              min={0}
                              {...field}
                              onChange={(val) =>
                                form.setFieldValue(field.name, val)
                              }
                            >
                              <NumberInputField placeholder={placeholder} />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          )}
                        </Field>
                      )}
                      {type === 'text' && (
                        <Field
                          validate={validate}
                          as={Input}
                          type={type}
                          placeholder={placeholder}
                          name={name}
                        />
                      )}
                      {type === 'select' && (
                        <Field type={type} name={name}>
                          {({ field, form }: any) =>
                            selectFrom === 'BALANCE' ? (
                              <MultiAssetSelector buttonTitle={placeholder} />
                            ) : null
                          }
                        </Field>
                      )}
                      <FormErrorMessage>
                        {errors[name] as string}
                      </FormErrorMessage>
                    </FormControl>
                  ),
                )}
              </DrawerBody>

              <DrawerFooter>
                <Button variant="outline" mr={3} onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme="blue" type="submit">
                  Confirm
                </Button>
              </DrawerFooter>
            </Box>
          )}
        </Formik>
      </DrawerContent>
    </Drawer>
  );
};

export { AddMenu };
