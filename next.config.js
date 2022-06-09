/** @type {import('next-sitemap').IConfig} */

const intercept = require('intercept-stdout');

function interceptStdout(text) {
  if (text.includes('Critical dependency')) {
    return '';
  }
  return text;
}

if (process.env.NODE_ENV === 'development') {
  intercept(interceptStdout);
}

module.exports = {
  reactStrictMode: true,
  webpack: (config) => {
    const customConfig = {
      experiments: {
        asyncWebAssembly: true,
        topLevelAwait: true,
        layers: true,
      },
    };

    return { ...config, ...customConfig };
  },
};
