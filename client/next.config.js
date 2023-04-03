module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['www.gravatar.com','localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: 'images',
      },
      {
        protocol: 'https',
        hostname: 'gravatar.com',
        port: '',
        pathname: 'avatar/00000000000000000000000000000000?d=mp&f=y',
      },
    ],
  },
}
