import { toADA } from '@/utils/crypto';

import { Text } from '@chakra-ui/react';

const AdaText = ({ lovelace }: { lovelace: string }) => (
  <>
    {parseInt(toADA(lovelace), 10).toLocaleString()}
    <Text fontSize={'xs'} ml="1" display="inline">
      ADA
    </Text>
  </>
);

export default AdaText;
