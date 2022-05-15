import { isAddress } from '@/utils/crypto/validation';
import { MenuPurpose } from './AddMenu';

export interface Prompt {
  type: string;
  placeholder: string;
  name: string;
  validate?: (value: any) => string | undefined;
  initialValue?: any;
}

interface MenuConstantItem {
  title: string;
  prompts: Prompt[];
}

const MENU_CONSTANTS: Record<MenuPurpose, MenuConstantItem> = {
  ADD_INPUT: {
    title: 'Add input',
    prompts: [
      {
        type: 'text',
        name: 'txHash',
        placeholder: 'Enter transaction hash',
      },
      {
        type: 'number',
        name: 'txId',
        placeholder: 'Enter transaction ID',
      },
    ],
  },
  ADD_OUTPUT: {
    title: 'Add output',
    prompts: [
      {
        type: 'text',
        placeholder: 'Enter address',
        name: 'address',
        validate: (val) => {
          if (!isAddress(val)) {
            return 'Invalid address';
          }
        },
      },
      {
        type: 'number',
        placeholder: 'Enter amount in ADA',
        name: 'adaAmount',
        validate: (val) => {
          if (val < 0) {
            return 'Amount must be positive';
          }
        },
      },
    ],
  },
};
export default MENU_CONSTANTS;
