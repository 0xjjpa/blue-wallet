/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['api.zora.co'],
  },
};

const withTM = require('next-transpile-modules')(['@zoralabs/v3']); // pass the modules you would like to see transpiled

module.exports = withTM(nextConfig);
