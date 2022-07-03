import Policy from '@/components/views/Policy';
import { PAGE_SIZE } from '@/constants';
import { MongoAsset } from '@/types';
import { isPolicyID } from '@/utils/crypto/validation';
import jungle from '@lib/jungle';
import { connectToDatabase } from '@lib/mongo';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';

export interface PolicyPageProps {
  tokenCount: number;
  assets: MongoAsset[];
  royaltyToken?: any;
  holdersCount: number;
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<PolicyPageProps> = async ({
  params,
}) => {
  const { db } = await connectToDatabase();

  const { policyId } = params as { policyId: string };

  if (typeof policyId !== 'string' || !isPolicyID(policyId)) {
    return {
      notFound: true,
      revalidate: 1,
    };
  }

  const { data } = await jungle.get(`collection-info/${policyId}`);

  const collection = db.collection('assets');

  const count = await collection.countDocuments({ policy: policyId });

  const royaltyToken = await collection.findOne({
    policy: policyId,
    asset_ascii: '',
  });

  const assets = await collection
    .find({ policy: policyId })
    .limit(PAGE_SIZE)
    .toArray();

  return {
    props: {
      tokenCount: count,
      assets: JSON.parse(JSON.stringify(assets)),
      holdersCount: data.CollectionInfo.holders,
      royaltyToken,
    },
  };
};

const PolicyPage: NextPage<PolicyPageProps> = (props) => {
  return <Policy {...props} />;
};

export default PolicyPage;
