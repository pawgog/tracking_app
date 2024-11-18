module.exports = ({ config }) => {
  return {
    ...config,
    plugins: [
      "expo-router",
      "expo-asset",
      [
        '@rnmapbox/maps',
        {
          RNMapboxMapsDownloadToken: '',
        },
      ],
    ],
  };
};