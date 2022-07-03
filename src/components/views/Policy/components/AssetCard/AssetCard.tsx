import Image from '@/components/shared/Image';
import Link from '@/components/shared/Link';
import { MongoAsset } from '@/types';
import { getImageUrl } from '@/utils/blockchain/images';
import { Box, Text } from '@chakra-ui/react';

interface AssetCardProps {
  asset: MongoAsset;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset }) => {
  return (
    <Box p="2" bg="gray.700" borderRadius={'md'} my="3" display={'flex'}>
      {asset.onchain_metadata?.image && (
        <Box mr="4">
          <Image
            width={80}
            height={80}
            src={getImageUrl(asset.onchain_metadata?.image)}
            alt="asset image"
          />
        </Box>
      )}
      <Box display={'flex'} flexDir="column">
        <Link href={`/token/${asset._id}`} fontWeight={'bold'}>
          {asset.asset_ascii}
        </Link>
        <Text as="code" display={'block'} fontSize="xs" color="gray.500" mt="1">
          {asset.fingerprint}
        </Text>
      </Box>
      <Text
        as="code"
        display={'block'}
        fontSize="lg"
        color="gray.300"
        ml="auto"
        mr="5"
        my="auto"
      >
        {asset.supply}
      </Text>
    </Box>
  );
};

export { AssetCard };
