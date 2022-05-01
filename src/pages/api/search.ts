import { deduceType } from '@/utils/crypto/validation';
import { NextApiHandler } from 'next';

export interface SearchResponse {
  type: 'TX_HASH' | 'ASSET_ID' | 'POLICY_ID' | 'ADDRESS' | 'STAKE_KEY' | null;
  error?: string;
}

const handler: NextApiHandler<SearchResponse> = (req, res) => {
  const { query } = req.query;

  const type = deduceType(query);

  if (type === null) {
    return res.status(200).json({
      error: 'Malformed value',
      type,
    });
  }

  return res.status(200).json({ type });
};

export default handler;
