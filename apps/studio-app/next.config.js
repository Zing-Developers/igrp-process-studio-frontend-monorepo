/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@igrp/framework-process-studio-types',
    '@igrp/framework-process-studio-bpmn-editor'
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