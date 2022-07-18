import { isAddress } from '@/utils/crypto/validation';
import { NextApiHandler } from 'next';
import { connectToDatabase } from '@lib/mongo';
import { PAGE_SIZE } from '@/constants';

export interface AddressTransactionsResponse {
  transactions: any[];
}

const handler: NextApiHandler = async (req, res) => {
  const { address, page } = req.query;
  const pageNum = parseInt(typeof page === 'string' ? page : '', 10);

  if (typeof address !== 'string' || !isAddress(address) || isNaN(pageNum)) {
    return res.status(400).json({
      error: 'Invalid parameters',
    });
  }
  const { db } = await connectToDatabase();

  const collection = db.collection('address_transactions');

  const addressTxns = collection
    .find(
      {
        address,
      },
      {
        projection: {
          tx_hash: 1,
        },
      },
    )
    .sort({
      timestamp: -1,
    })
    .skip(PAGE_SIZE * (pageNum - 1))
    .limit(PAGE_SIZE);

  const cursor = await addressTxns.map((t) => t.tx_hash).toArray();

  const transactions = await db
    .collection('transactions')
    .find({
      hash: {
        $in: cursor,
      },
    })
    .toArray();

  res.status(200).json(JSON.parse(JSON.stringify(transactions)));
};

export default handler;
