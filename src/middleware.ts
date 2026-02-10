// src/middleware.ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './core/i18n/config';

export default createMiddleware(routing);

export const config = {
  // 只保留一个最简洁的 matcher
  // 匹配所有路径，但排除 api、_next、_vercel 和静态文件
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
