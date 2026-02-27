/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: { domains: ['ipfs.io', 'cloudflare-ipfs.com'] }
}
module.exports = nextConfig
