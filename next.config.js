/** @type {import('next').NextConfig} */
const dotenv = require('dotenv');

dotenv.config();
const nextConfig = {
  reactStrictMode: true,
  api: {
    responseLimit: false,
  },
  env: {
    apiURL: 'http://localhost:3000',
    webURL: 'http://localhost:3001'
  },
}

module.exports = nextConfig
