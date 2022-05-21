import { GetStaticProps, NextPage } from 'next';

import ProtocolParams from '@/components/views/ProtocolParams';
import blockfrost from '@lib/blockfrost';
import camelcaseKeys from 'camelcase-keys';

export interface ProtocolParamsProps {
  protocolParams: any;
}

export const getStaticProps: GetStaticProps<ProtocolParamsProps> = async () => {
  const latestEpoch = await blockfrost.epochsLatest();
  const params = await blockfrost.epochsParameters(latestEpoch.epoch);

  return {
    props: {
      protocolParams: camelcaseKeys(params),
    },
  };
};

const ProtocolParamsPage: NextPage<ProtocolParamsProps> = (props) => {
  return <ProtocolParams {...props} />;
};

export default ProtocolParamsPage;
