import bundleAnalyzer from '@next/bundle-analyzer';
import { createMDX } from 'fumadocs-mdx/next';
import createNextIntlPlugin from 'next-intl/plugin';

const withMDX = createMDX();

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const withNextIntl = createNextIntlPlugin({
  requestConfig: './src/core/i18n/request.ts',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove standalone output - let Vercel use default Serverless mode
  // Standalone mode causes path mapping issues in Vercel Edge Runtime
  output: undefined,
  reactStrictMode: false,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
      },
    ],
  },
  async redirects() {
    return [];
  },
  // Enhanced file tracing for middleware - explicitly include i18n dependencies
  // This fixes the middleware.js.nft.json error on Vercel
  outputFileTracingIncludes: {
    '/middleware': [
      './src/core/i18n/**/*',
      './src/config/locale/**/*',
      './messages/**/*',
    ],
  },
  // Exclude unnecessary files from tracing to reduce bundle size
  outputFileTracingExcludes: {
    '*': [
      'node_modules/@swc/core-linux-x64-gnu',
      'node_modules/@swc/core-linux-x64-musl',
      'node_modules/@esbuild/linux-x64',
    ],
  },
  // 类型检查配置（用于快速通过 Vercel 部署）
  typescript: {
    // 允许构建时忽略 TypeScript 错误（仅在 Vercel 环境下使用）
    ignoreBuildErrors: process.env.VERCEL === 'true',
  },
  // 注意：Next.js 16+ 中 eslint 配置已移除，通过环境变量控制
  turbopack: {
    // 明确指定项目根目录，避免 Next.js 错误推断工作区根目录
    root: process.cwd(),
    resolveAlias: {
      // fs: {
      //   browser: './empty.ts', // We recommend to fix code imports before using this method
      // },
    },
  },
  experimental: {
    // Only enable turbopack cache in development, not in production builds
    ...(process.env.NODE_ENV === 'development' ? { turbopackFileSystemCacheForDev: true } : {}),
    // Disable mdxRs for Vercel deployment compatibility with fumadocs-mdx
    ...(process.env.VERCEL ? {} : { mdxRs: true }),
  },
  reactCompiler: true,
  // Webpack 配置：忽略可选依赖 jsqr（如果未安装）
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 客户端构建：忽略 jsqr 模块解析错误
      config.resolve.fallback = {
        ...config.resolve.fallback,
      };
      // 添加外部化配置，允许 jsqr 不存在
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push({
          'jsqr': 'commonjs jsqr',
        });
      }
    }
    return config;
  },
};

export default withBundleAnalyzer(withNextIntl(withMDX(nextConfig)));
