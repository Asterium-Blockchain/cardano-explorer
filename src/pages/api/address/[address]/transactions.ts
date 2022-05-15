import blockfrost from '@/utils/blockchain/blockfrost';
import { isAddress } from '@/utils/crypto/validation';
import { NextApiHandler } from 'next';

export interface AddressTransactionsResponse {
  transactions: Awaited<ReturnType<typeof blockfrost.addressesTransactions>>;
  hasMore: boolean;
}

const handler: NextApiHandler = async (req, res) => {
  const { address, page } = req.query;
  const pageNum = parseInt(typeof page === 'string' ? page : '', 10);

  if (!isAddress(address) || typeof address !== 'string' || isNaN(pageNum)) {
    return res.status(400).json({
      error: 'Invalid parameters',
    });
  }

  const addressTxns = await blockfrost.addressesTransactions(address, {
    count: 26,
    page: pageNum,
  });

  res.status(200).json({
    transactions: addressTxns,
    hasMore: addressTxns.length === 26,
  });
};

export default handler;
