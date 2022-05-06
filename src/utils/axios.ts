import axios from 'axios';

export default axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_SERVER_URL || 'https://explorer.asterium.dev/api',
});
