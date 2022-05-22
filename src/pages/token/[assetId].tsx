import Asset from '@/components/views/Asset';
import { isAssetID } from '@/utils/crypto/validation';
import blockfrost from '@lib/blockfrost';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';

export interface AssetPageProps {
  asset: Awaited<ReturnType<typeof blockfrost.assetsById>>;
  mintTx: Awaited<ReturnType<typeof blockfrost.txs>>;
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<AssetPageProps> = async ({
  params,
}) => {
  const { assetId } = params as { assetId: string };

  if (typeof assetId !== 'string' || !isAssetID(assetId)) {
    return {
      notFound: true,
      revalidate: 1,
    };
  }

  const asset = await blockfrost.assetsById(assetId);
  const mintTx = await blockfrost.txs(asset.initial_mint_tx_hash);
  return {
    props: {
      asset,
      mintTx,
    },
  };
};

const AssetPage: NextPage<AssetPageProps> = (props) => {
  return <Asset {...props} />;
};

export default AssetPage;
