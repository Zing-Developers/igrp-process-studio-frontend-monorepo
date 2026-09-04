import { createProcessStudioClient } from '@irn/framework-process-studio-client';

// Environment configuration for server-side
const getServerConfig = () => {
  const environment = process.env.NODE_ENV || 'development';
  
  const configs = {
    development: {
      baseUrl: process.env.NEXT_PUBLIC_API_GATEWAY || 'http://localhost:8085',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    },
    staging: {
      baseUrl: process.env.NEXT_PUBLIC_API_GATEWAY || 'https://staging-api.igrp.cv',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.API_TOKEN}`,
      },
    },
    production: {
      baseUrl: process.env.NEXT_PUBLIC_API_GATEWAY || 'https://api.igrp.cv',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.API_TOKEN}`,
      },
    },
    test: {
      baseUrl: 'http://localhost:8085',
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    },
  };

  return configs[environment as keyof typeof configs] || configs.development;
};

// Create server-side client instance
export const serverClient = createProcessStudioClient(getServerConfig());

// Helper function to create client with custom config
export const createServerClient = (customConfig?: {
  baseUrl?: string;
  timeout?: number;
  headers?: Record<string, string>;
}) => {
  const baseConfig = getServerConfig();
  return createProcessStudioClient({
    ...baseConfig,
    ...customConfig,
  });
};
