import { NextApiHandler } from 'next';
import { block, Prisma, tx, tx_in, tx_out } from '@prisma/client';
import { isAddress } from '@/utils/crypto/validation';
import prisma from 'prisma/client';
import blockfrost from '@/utils/blockchain/blockfrost';
import { fromHex } from 'lucid-cardano';

export interface AddressTransactionsResponse {
  transactions: (tx & {
    block: block;
    tx_out: tx_out[];
    tx_in_txTotx_in_tx_out_id: (tx_in & {
      tx_txTotx_in_tx_out_id: tx & {
        tx_out: tx_out[];
      };
    })[];
  })[];
  hasMore: boolean;
}

const handler: NextApiHandler<
  AddressTransactionsResponse | { error: string }
> = async (req, res) => {
  const { address, page } = req.query;
  const pageNum = Number(page);

  if (!isAddress(address) || typeof address !== 'string') {
    return res.status(400).json({
      error: 'Invalid parameters',
    });
  }

  const txs = await blockfrost.addressesTransactions(address, {
    count: 26,
    page: pageNum,
  });

  const query: Prisma.txFindManyArgs['where'] = {
    hash: {
      in: txs.map((tx) => fromHex(tx.tx_hash)),
    },
  };
  const transactions = await prisma.tx.findMany({
    where: query,
    orderBy: {
      block: {
        time: 'desc',
      },
    },
    include: {
      block: true,
      tx_out: true,
      tx_in_txTotx_in_tx_out_id: {
        include: {
          tx_txTotx_in_tx_out_id: {
            include: {
              tx_out: true,
            },
          },
        },
      },
    },
  });

  res.status(200).send({
    transactions: transactions.slice(0, 25),
    hasMore: transactions.length > 25,
  });
};

export default handler;
