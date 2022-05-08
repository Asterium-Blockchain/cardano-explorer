import useStore from '@/store/useStore';
import { BLOCKCHAIN_LOAD_FETCH_INTERVAL } from '@/constants';
import useInterval from './useInterval';

const useBlockchainLoad = () => {
  const blockchainLoad = useStore((state) => state.blockchainLoad);
  const fetchBlockchainLoad = useStore((state) => state.fetchBlockchainLoad);

  useInterval(fetchBlockchainLoad, BLOCKCHAIN_LOAD_FETCH_INTERVAL);

  return blockchainLoad;
};

export default useBlockchainLoad;
