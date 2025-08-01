module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo', '@babel/preset-typescript'],
    env: {
      test: {
        plugins: ['@babel/plugin-transform-runtime']
      }
    }
  };
};