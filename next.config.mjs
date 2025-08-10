/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Disable webpack's WebAssembly features that cause issues on Windows
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: false,
      syncWebAssembly: false,
    }
    
    // Disable webpack's hash features that can cause issues
    config.optimization = {
      ...config.optimization,
      moduleIds: 'named',
      chunkIds: 'named',
    }
    
    return config
  },
}

export default nextConfig
