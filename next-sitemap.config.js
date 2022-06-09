/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: process.env.NEXT_PUBLIC_VERCEL_URL || 'https://example.com',
  generateRobotsTxt: true, // (optional)
  // ...other options
};

export default config;
