import { BlockFrostAPI } from '@blockfrost/blockfrost-js';

const apiKey = process.env.BLOCKFROST;

const blockfrost = new BlockFrostAPI({
  projectId: apiKey || '',
});

export default blockfrost;
