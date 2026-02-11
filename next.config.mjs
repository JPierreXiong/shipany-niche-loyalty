import createNextIntlPlugin from 'next-intl/plugin';
import withBundleAnalyzer from '@next/bundle-analyzer';
import createMDX from '@next/mdx';

// 核心修复：添加 next-intl 插件，指向 i18n 配置文件
const withNextIntl = createNextIntlPlugin('./src/core/i18n/request.ts');

// MDX 配置
const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

// Bundle Analyzer 配置
const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  
  // 启用 MDX Rust 编译器
  experimental: {
    mdxRs: true,
  },
  
  // 必须添加这个，防止 D 盘根目录下的系统文件锁死编译进程
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      poll: 1000, // 使用轮询模式，避免文件监听问题
      aggregateTimeout: 300,
      ignored: /node_modules|\.next|\.git|pagefile\.sys|DumpStack\.log\.tmp/,
    };
    return config;
  },
};

// 正确的插件包装顺序：bundleAnalyzer -> withNextIntl -> withMDX -> nextConfig
export default bundleAnalyzer(withNextIntl(withMDX(nextConfig)));
