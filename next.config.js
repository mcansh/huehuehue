const withTypescript = require('@zeit/next-typescript');

const HUE_BRIDGE_USERNAME = 'gT3baNOF-fXFvjZBZBTQPy7-wlygSlhdtjh-IgQV';
const HUE_BRIDGE_API = `http://10.0.1.15/api/${HUE_BRIDGE_USERNAME}`;

const nextConfig = {
  target: 'serverless',

  env: {
    VERSION: require('./package.json').version,
    HUE_BRIDGE_USERNAME,
    HUE_BRIDGE_API,
  },
};

module.exports = withTypescript(nextConfig);
