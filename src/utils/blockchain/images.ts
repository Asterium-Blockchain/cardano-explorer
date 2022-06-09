const sizeWidths = {
  sm: 350,
  md: 600,
  lg: 900,
  xl: 1200,
};

export const getImageUrl = (
  onchainImage: string,
  size: keyof typeof sizeWidths = 'md',
) => {
  if (onchainImage.startsWith('ipfs://')) {
    const [, cid] = onchainImage.split('ipfs://');
    return onchainImage.replace(
      'ipfs://',
      `https://image-optimizer-on-demand-55l7x7mqsa-uc.a.run.app/${cid}?width=${sizeWidths[size]}`,
    );
  }
  return null;
};
