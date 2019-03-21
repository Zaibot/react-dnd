const path = require('path');

module.exports = ({ config, mode }) => {
  config.module.rules.push(
    {
      test: /\.tsx$/,
      loader: require.resolve(`awesome-typescript-loader`),
      options: { transpileOnly: true },
    }, {
      include: path.join(__dirname, `../stories`),
      test: /\.tsx?$/,
      loader: require.resolve(`@storybook/addon-storysource/loader`),
      options: { parser: `typescript` },
      enforce: `pre`,
    });

  config.resolve.extensions.push(`.tsx`);

  return config;
};
