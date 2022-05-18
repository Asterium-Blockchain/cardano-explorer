import useStore from '@/store/useStore';
import { useEffect } from 'react';

const useProtocolParams = () => {
  const fetchProtocolParams = useStore((state) => state.fetchProtocolParams);
  const protocolParams = useStore((state) => state.protocolParams);

  useEffect(() => {
    fetchProtocolParams();
  }, [fetchProtocolParams]);

  return protocolParams;
};

export default useProtocolParams;
