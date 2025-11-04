/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/highlights',
  assetPrefix: '/highlights/',
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: '/highlights',
  },
};

module.exports = nextConfig;
