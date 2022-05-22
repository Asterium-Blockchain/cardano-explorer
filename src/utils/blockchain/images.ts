export const getImageUrl = (onchainImage: string) => {
  if (onchainImage.startsWith('ipfs://')) {
    return onchainImage.replace('ipfs://', 'https://cf-ipfs.com/ipfs/');
    // return onchainImage.replace('ipfs://', 'https://ipfs.io/ipfs/');
  }
  return null;
};
