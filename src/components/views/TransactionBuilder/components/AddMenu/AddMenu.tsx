import useProtocolParams from '@/hooks/useProtocolParams';
import useStore from '@/store/useStore';
import { Amount } from '@/types';
import { assetsToValue } from '@/utils/blockchain/assetClasses';
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
import { C } from 'lucid-cardano';
import { useEffect } from 'react';
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

  const protocolParams = useProtocolParams();

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
          ...values.multiasset,
        ],
      });
    }
    onClose();
  };

  const handleChangeMultiAsset =
    (field: any, form: any) => (selectedAmount: Amount) => {
      form.setFieldValue(field.name, selectedAmount);
      const minReq = C.min_ada_required(
        assetsToValue(selectedAmount),
        false,
        C.BigNum.from_str(protocolParams?.coins_per_utxo_word || '0'),
      ).to_str();
      const minReqNum = parseInt(minReq, 10) / 1000000;
      const currNum = parseInt(form.values.adaAmount, 10);

      if (isNaN(currNum) || currNum < minReqNum) {
        form.setFieldValue('adaAmount', minReqNum);
      }
    };

  return (
    <Drawer placement="right" onClose={onClose} {...rest} size="md">
      <DrawerOverlay />

      <DrawerContent>
        <Formik initialValues={formInitialValues} onSubmit={handleSubmit}>
          {({ handleSubmit, errors, touched }) => (
            <Box
              onSubmit={handleSubmit as any}
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
                              <MultiAssetSelector
                                onChange={handleChangeMultiAsset(field, form)}
                              />
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
