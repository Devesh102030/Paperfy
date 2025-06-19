import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client']
  }
};

module.exports = {
 webpack: (config: any) => {
   config.resolve.alias.canvas = false;

   return config;
 },
}

export default nextConfig;
