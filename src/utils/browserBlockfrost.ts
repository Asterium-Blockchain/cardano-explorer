import axios from 'axios';

const browserBlockfrost = axios.create({
  baseURL: 'https://cardano-mainnet.blockfrost.io/api/v0',
  headers: {
    project_id: process.env.NEXT_PUBLIC_BLOCKFROST_KEY || '',
  },
});

export default browserBlockfrost;
