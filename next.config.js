const path = require('path')
const WindiCSSWebpackPlugin = require('windicss-webpack-plugin')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  webpack: (config) => {
    config.plugins.push(new WindiCSSWebpackPlugin())
    return config
  },
}

module.exports = nextConfig
