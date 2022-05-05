import useStore from '@/store/useStore';
import { useInterval } from '@chakra-ui/react';

import { ADA_PRICE_FETCH_INTERVAL } from '@/constants';

const useAdaPrice = () => {
  const fetchPrice = useStore((state) => state.fetchAdaPrice);
  const adaPrice = useStore((state) => state.adaPrice);

  useInterval(fetchPrice, ADA_PRICE_FETCH_INTERVAL);

  return adaPrice;
};

export default useAdaPrice;
