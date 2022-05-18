import axios from 'axios';

export default axios.create({
  baseURL: 'https://api.koios.rest/api/v0',
});
