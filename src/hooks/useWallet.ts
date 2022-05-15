import useStore from '@/store/useStore';

const useWallet = () => {
  const connectWallet = useStore((state) => state.connectWallet);
  const api = useStore((state) => state.api);
  const walletLoading = useStore((state) => state.walletLoading);
  const walletName = useStore((state) => state.walletName);
  const address = useStore((state) => state.address);
  const balance = useStore((state) => state.balance);

  return {
    connectWallet,
    api,
    walletLoading,
    walletName,
    address,
    balance,
  };
};
export default useWallet;
