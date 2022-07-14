const path = require('path')
const WindiCSSWebpackPlugin = require('windicss-webpack-plugin')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  // trailingSlash: true,
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
        destination: 'http:///120.26.62.151:9123/api/v1/operateApi/:path*',
      },
      {
        source: '/api/v1/setting/:path*',
        destination: 'http://192.168.166.199:9123/api/v1/setting/:path*',
      },
      {
        source: '/api/v1/dataSource/:path*',
        destination: 'http://192.168.166.199:9123/api/v1/dataSource/:path*',
      },
      {
        source: '/api/v1/auth',
        destination: 'http://192.168.166.199:9123/api/v1/auth',
      },
      {
        source: '/api/v1/auth/:path*',
        destination: 'http://192.168.166.199:9123/api/v1/auth',
      },
      {
        source: '/api/v1/role',
        destination: 'http://192.168.166.199:9123/api/v1/role',
      },
      {
        source: '/api/v1/role/:path*',
        destination: 'http://192.168.166.199:9123/api/v1/role',
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
  images: {
    loader: 'akamai',
    path: '',
  },
}

module.exports = nextConfig
