import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  basePath: process.env.BASEPATH,
  images: {
    remotePatterns: [
      {
        hostname: 'm.media-amazon.com',
        protocol: 'https'
      }
      // {
      //   protocol: "https",
      //   hostname: "**",
      // },
      // {
      //   protocol: "http",
      //   hostname: "**",
      // },
    ]
  },
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/add-management/addprofile',
        permanent: true,
        locale: false
      }
    ]
  }
}

export default nextConfig
