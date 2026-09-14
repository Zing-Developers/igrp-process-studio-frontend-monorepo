/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@irn/framework-process-studio-client',
    '@irn/framework-process-studio-types',
    '@irn/framework-process-studio-bpmn-editor'
  ],
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
}

export default nextConfig
