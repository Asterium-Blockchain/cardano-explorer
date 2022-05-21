import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import blockfrost from '@lib/blockfrost';

import { isTxHash } from '@/utils/crypto/validation';
import Transaction from '@/components/views/Transaction';

interface TransactionPageProps {
  transaction: Awaited<ReturnType<typeof blockfrost.txs>>;
  utxos: Awaited<ReturnType<typeof blockfrost.txsUtxos>>;
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    fallback: 'blocking',
    paths: [],
  };
};

export const getStaticProps: GetStaticProps<TransactionPageProps> = async (
  req,
) => {
  const { txHash } = req.params as { txHash: string };

  if (!isTxHash(txHash)) {
    return {
      notFound: true,
      revalidate: 1,
    };
  }

  const transaction = await blockfrost.txs(txHash);
  const utxos = await blockfrost.txsUtxos(txHash);

  return {
    props: {
      transaction,
      utxos: utxos,
    },
  };
};

const TransactionPage: NextPage<TransactionPageProps> = ({
  transaction,
  utxos,
}) => {
  return <Transaction transaction={transaction} utxos={utxos} />;
};

export default TransactionPage;
