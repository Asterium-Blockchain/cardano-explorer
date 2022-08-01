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
  webpack: (config, { isServer }) => {
    const customConfig = {
      experiments: {
        asyncWebAssembly: true,
        topLevelAwait: true,
        layers: true
      }
    };
    if (isServer) {
      config.output.webassemblyModuleFilename = './../static/wasm/[modulehash].wasm';
    } else {
      config.output.webassemblyModuleFilename = 'static/wasm/[modulehash].wasm';
    }
    config.optimization.moduleIds = 'named';
    return { ...config, ...customConfig };
  }
};
