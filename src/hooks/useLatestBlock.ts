import { LATEST_BLOCK_FETCH_INTERVAL } from '@/constants';
import useStore from '@/store/useStore';
import { useInterval } from 'ahooks';

const useLatestBlock = () => {
  const latestBlock = useStore((state) => state.latestBlock);
  const fetchLatestBlock = useStore((state) => state.fetchLatestBlock);

  useInterval(fetchLatestBlock, LATEST_BLOCK_FETCH_INTERVAL);

  return latestBlock;
};

export default useLatestBlock;
