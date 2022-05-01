import { BlockFrostAPI } from '@blockfrost/blockfrost-js';

const apiKey = process.env.BLOCKFROST;

const API = new BlockFrostAPI({
  projectId: apiKey || '',
});

export default API;
