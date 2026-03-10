/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@javascript-workspace/db",
    "@javascript-workspace/schemas",
    "@javascript-workspace/ui",
  ],
};

export default nextConfig;
