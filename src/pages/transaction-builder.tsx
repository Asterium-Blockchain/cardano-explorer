import { NextPage } from 'next';
import TransactionBuilder from '@/components/views/TransactionBuilder';

const TransactionBuilderPage: NextPage = (props) => {
  return <TransactionBuilder {...props} />;
};
export default TransactionBuilderPage;
