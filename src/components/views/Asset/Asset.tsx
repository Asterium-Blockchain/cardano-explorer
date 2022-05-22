import Image from '@/components/shared/Image';
import { AssetPageProps } from '@/pages/token/[assetId]';
import { getImageUrl } from '@/utils/blockchain/images';
import { hex2a } from '@/utils/strings';
import { Container, Grid, GridItem, Heading } from '@chakra-ui/react';

const Asset: React.FC<AssetPageProps> = ({ asset }) => {
  const {
    onchain_metadata: onchainMetadata,
    asset: assetId,
    fingerprint,
    asset_name: assetName,
    initial_mint_tx_hash: mintTxHash,
    quantity,
  } = asset;

  return (
    <Container maxW={'container.xl'} mt="12">
      <Grid
        templateColumns={'repeat(12, 1fr)'}
        templateRows={'repeat(12, 1fr)'}
        gap="2"
      >
        <GridItem colSpan={3} rowSpan={3}>
          {typeof onchainMetadata?.image === 'string' && (
            <Image
              src={getImageUrl(onchainMetadata.image)}
              alt="Token image"
              width={275}
              height={300}
            />
          )}
        </GridItem>
        <GridItem colSpan={6}>
          <Heading fontSize={'3xl'} mt="2">
            {onchainMetadata?.name || hex2a(assetName || '')}
          </Heading>
        </GridItem>
      </Grid>
    </Container>
  );
};

export { Asset };
