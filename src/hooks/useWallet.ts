import useStore from '@/store/useStore';

const useWallet = () => {
  const connectWallet = useStore((state) => state.connectWallet);
  const api = useStore((state) => state.api);
  const walletLoading = useStore((state) => state.walletLoading);
  const walletName = useStore((state) => state.walletName);
  const address = useStore((state) => state.address);

  return {
    connectWallet,
    api,
    walletLoading,
    walletName,
    address,
  };
};
export default useWallet;
