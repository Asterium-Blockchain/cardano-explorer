import { createClient } from 'redis';

const scrolls = createClient({
  url: process.env.SCROLLS_URL,
});

export default scrolls;
