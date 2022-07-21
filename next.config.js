const path = require('path')
const WindiCSSWebpackPlugin = require('windicss-webpack-plugin')
const withAntdLess = require('next-plugin-antd-less')

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
        source: '/api/v1/schemas/:path*',
        destination: 'http://127.0.0.1:8080/schemas/:path*',
      },
      {
        source: '/api/v1/sources/:path*',
        destination: 'http://127.0.0.1:8080/sources/:path*',
      },
      {
        source: '/api/v1/:path*',
        destination: 'http://120.26.62.151:9123/api/v1/:path*',
        // destination: 'http://192.168.166.199:9123/api/v1/:path*',
        // destination: 'http://localhost:8080/api/v1/:path*',
      },
      {
        source: '/api/main/graphql',
        destination: 'http://120.26.62.151:9991/api/main/graphql',
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
  modifyVars: { '@primary-color': '#E92E5E' },
}

module.exports = withAntdLess(nextConfig)
