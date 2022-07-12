const path = require('path')
const WindiCSSWebpackPlugin = require('windicss-webpack-plugin')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/gql-schema',
        destination: 'http://127.0.0.1:8081/schema.graphql',
      },
      {
        source: '/api/v1/gql-query-str',
        destination: 'http://127.0.0.1:8081/query.gql',
      },
      {
        source: '/api/v1/operateApi/:path*',
        destination: 'http://192.168.166.199:9123/api/v1/operateApi/:path*',
      },
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:8080/:path*',
      },
    ]
  },
  webpack: (config) => {
    config.plugins.push(new WindiCSSWebpackPlugin())
    return config
  },
}

module.exports = nextConfig
