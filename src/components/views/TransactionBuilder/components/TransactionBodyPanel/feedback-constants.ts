import { BuilderErrors } from '@/store/createTransactionBuilderSlice';

const BUILDER_FEEDBACK_CONSTANTS: Record<BuilderErrors, string> = {
  INPUTS_EXHAUSTED: 'Not enough balance',
  UNKOWN_ERROR: 'Transaction not possible',
};
export default BUILDER_FEEDBACK_CONSTANTS;
