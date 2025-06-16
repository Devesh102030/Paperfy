import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
};

module.exports = {
 webpack: (config: any) => {
   config.resolve.alias.canvas = false;

   return config;
 },
}

export default nextConfig;
