import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import blockfrost from '@lib/blockfrost';

import { isTxHash } from '@/utils/crypto/validation';
import Transaction from '@/components/views/Transaction';
import { connectToDatabase } from '@lib/mongo';
import { Amount } from '@/types';

interface TransactionPageProps {
  transaction: Awaited<ReturnType<typeof blockfrost.txs>>;
  utxos: Awaited<ReturnType<typeof blockfrost.txsUtxos>>;
  metadata: Awaited<ReturnType<typeof blockfrost.txsMetadata>>;
  mintAmount: Amount;
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

  const { db } = await connectToDatabase();
  const mongoTransaction = await db
    .collection('transactions')
    .findOne({ hash: txHash });
  const transaction = await blockfrost.txs(txHash);
  const utxos = await blockfrost.txsUtxos(txHash);
  const metadata = await blockfrost.txsMetadata(txHash);

  return {
    props: {
      transaction,
      utxos,
      metadata,
      mintAmount:
        mongoTransaction?.mint?.map((m: any) => ({
          unit: m.policy.concat(m.asset),
          quantity: m.quantity.toString(),
        })) || null,
    },
  };
};

const TransactionPage: NextPage<TransactionPageProps> = (props) => {
  return <Transaction {...props} />;
};

export default TransactionPage;
