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
