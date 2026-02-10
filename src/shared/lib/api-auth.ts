/**
 * API 路由认证辅助函数
 * 用于 Niche Loyalty API 路由的统一认证检查
 */

import { respErr } from '@/shared/lib/resp';
import { getUserInfo, findUserById } from '@/shared/models/user';
import type { User } from '@/shared/models/user';

/**
 * 验证用户认证并返回用户信息
 * 如果未认证，返回错误响应
 */
export async function requireAuth(): Promise<{ user: User; error?: null } | { user?: null; error: Response }> {
  const sessionUser = await getUserInfo();
  
  if (!sessionUser) {
    return {
      error: respErr('no auth, please sign in', 401),
    };
  }

  // 从数据库获取完整的用户信息
  const user = await findUserById(sessionUser.id);
  
  if (!user) {
    return {
      error: respErr('user not found', 404),
    };
  }

  return { user, error: null };
}




