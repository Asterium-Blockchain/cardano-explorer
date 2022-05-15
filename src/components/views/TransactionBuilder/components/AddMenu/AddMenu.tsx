import useStore from '@/store/useStore';
import {
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
    <Drawer placement="right" onClose={onClose} {...rest}>
      <DrawerOverlay />

      <DrawerContent>
        <Formik initialValues={formInitialValues} onSubmit={handleSubmit}>
          {({ handleSubmit, errors, touched }) => (
            <form onSubmit={handleSubmit}>
              <DrawerCloseButton />
              <DrawerHeader>{title}</DrawerHeader>

              <DrawerBody>
                {prompts.map(({ type, placeholder, validate, name }, idx) => (
                  <FormControl
                    key={idx}
                    isInvalid={!!errors[name] && !!touched[name]}
                    mt={'3'}
                  >
                    {type === 'number' ? (
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
                    ) : (
                      <Field
                        validate={validate}
                        as={Input}
                        type={type}
                        placeholder={placeholder}
                        name={name}
                      />
                    )}
                    <FormErrorMessage>
                      {errors[name] as string}
                    </FormErrorMessage>
                  </FormControl>
                ))}
              </DrawerBody>

              <DrawerFooter>
                <Button variant="outline" mr={3} onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme="blue" type="submit">
                  Confirm
                </Button>
              </DrawerFooter>
            </form>
          )}
        </Formik>
      </DrawerContent>
    </Drawer>
  );
};

export { AddMenu };
