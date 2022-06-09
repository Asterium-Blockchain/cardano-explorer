import { NextSeo } from 'next-seo';

interface Image {
  url: string;
  width: number;
  height: number;
  alt: string;
  type: string;
}

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  images?: Image[];
}

const SEO: React.FC<SEOProps> = ({
  title = 'Asterium: The Cardano Community Blockchain explorer',
  description = 'Search transactions, tokens, accounts and addresses in this open source Cardano blockchain explorer.',
  path = '/',
  images,
}) => {
  return (
    <NextSeo
      title={title}
      description={description}
      openGraph={{
        url: process.env.NEXT_PUBLIC_VERCEL_URL + path,
        title,
        description,
        images,
      }}
      twitter={{
        handle: '@scheredev',
      }}
    />
  );
};

export { SEO };
