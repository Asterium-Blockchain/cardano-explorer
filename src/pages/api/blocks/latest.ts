import blockfrost from '@lib/blockfrost';
import { NextApiHandler } from 'next';

export interface LatestBlockResponse {
  latestBlock: Awaited<ReturnType<typeof blockfrost.blocksLatest>>;
}

const handler: NextApiHandler<LatestBlockResponse> = async (_req, res) => {
  res.status(200).send({
    latestBlock: await blockfrost.blocksLatest(),
  });
};

export default handler;
