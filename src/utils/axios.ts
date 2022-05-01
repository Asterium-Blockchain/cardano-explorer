import axios from 'axios';

export default axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000/api',
});
