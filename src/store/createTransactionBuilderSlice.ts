import { amountToAssets } from '@/utils/crypto';
import { decodeLucidError } from '@/utils/strings';
import { Blockfrost, C, Lucid, Tx, TxComplete } from 'lucid-cardano';
import { GetState, SetState } from 'zustand';
import { WalletName } from './createWalletSlice';
import { AppState } from './useStore';

type Amount = {
  unit: string;
  quantity: string;
}[];

interface Input {
  txHash: string;
  txIndex: number;
}
interface Output {
  address: string;
  amount: Amount;
}

export enum BuilderErrors {
  INPUTS_EXHAUSTED = 'INPUTS_EXHAUSTED',
  UNKOWN_ERROR = 'UNKOWN_ERROR',
}

export interface TransactionBuilderSlice {
  inputs: Input[];
  outputs: Output[];
  rawTx: TxComplete | null;
  isBuilding: boolean;
  builderError: BuilderErrors | null;
  fee: string | null;
  txHash: string | null;
  resetBuilder: () => void;
  addInput: (input: Input) => void;
  addOutput: (output: Output) => void;
  removeInput: (index: number) => void;
  removeOutput: (index: number) => void;
  buildTransaction: (walletName: WalletName) => Promise<void>;
  signTransaction: () => Promise<void>;
}

const createTransactionBuilderSlice = (
  set: SetState<AppState>,
  get: GetState<AppState>,
) => ({
  inputs: [],
  outputs: [],
  rawTx: null,
  isBuilding: false,
  builderError: null,
  fee: null,
  txHash: null,
  addInput: (input: Input) => {
    set((state) => ({
      ...state,
      inputs: [...state.inputs, input],
    }));
  },
  addOutput: (output: Output) => {
    set((state) => ({
      ...state,
      outputs: [...state.outputs, output],
    }));
  },
  removeInput: (idx: number) => {
    set((state) => ({
      ...state,
      inputs: state.inputs.filter((_, i) => i !== idx),
    }));
  },
  removeOutput: (idx: number) => {
    set((state) => ({
      ...state,
      outputs: state.outputs.filter((_, i) => i !== idx),
    }));
  },
  resetBuilder: () => {
    set((state) => ({
      ...state,
      inputs: [],
      outputs: [],
      txHash: null,
    }));
  },
  buildTransaction: async (wallet: WalletName) => {
    set((state) => ({ ...state, isBuilding: true, builderError: null }));
    try {
      const { inputs, outputs } = get();

      if (inputs.length === 0 && outputs.length === 0) {
        set(() => ({ isBuilding: false, fee: null }));
        return;
      }

      await Lucid.initialize(
        new Blockfrost(
          'https://cardano-mainnet.blockfrost.io/api/v0',
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          process.env.NEXT_PUBLIC_BLOCKFROST_KEY,
        ),
        'Mainnet',
      );

      await Lucid.selectWallet(wallet);

      let tx = Tx.new();
      outputs.forEach(
        ({ address, amount }) =>
          (tx = tx.payToAddress(address, amountToAssets(amount))),
      );

      const completed = await tx.complete();

      const transactionBody = C.TransactionBody.from_bytes(
        completed.txComplete.body().to_bytes(),
      );

      set((state) => ({
        ...state,
        isBuilding: false,
        rawTx: completed,
        fee: transactionBody.fee().to_str(),
      }));
    } catch (error) {
      set((state) => ({
        ...state,
        isBuilding: false,
        builderError: decodeLucidError(error),
      }));
    }
  },
  signTransaction: async () => {
    set((state) => ({ ...state, isBuilding: true, builderError: null }));
    const rawTx = get().rawTx!;
    try {
      const signed = (await rawTx.sign()).complete();
      const txHash = await signed.submit();
      set((state) => ({ ...state, isBuilding: false, txHash }));
    } catch (error) {
      set((state) => ({
        ...state,
        isBuilding: false,
        builderError: decodeLucidError(error),
      }));
    }
  },
});

export default createTransactionBuilderSlice;
