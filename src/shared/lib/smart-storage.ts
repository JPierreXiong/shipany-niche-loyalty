/**
 * Smart Storage Decision System
 * 智能存储决策系统 - 自动判断数据应存储到数据库还是Blob
 */

import { put, del, list } from '@vercel/blob';

// 存储类型
export enum StorageType {
  DATABASE = 'database',
  BLOB = 'blob',
}

// 数据类型分类
export enum DataCategory {
  // 数据库类型
  USER_INFO = 'user_info',
  SUBSCRIPTION = 'subscription',
  STORE_INFO = 'store_info',
  MEMBER_INFO = 'member_info',
  CAMPAIGN = 'campaign',
  DISCOUNT_CODE = 'discount_code',
  
  // Blob类型
  CSV_IMPORT = 'csv_import',
  EMAIL_ATTACHMENT = 'email_attachment',
  BRAND_LOGO = 'brand_logo',
  BRAND_ASSETS = 'brand_assets',
  EXPORT_FILE = 'export_file',
  USER_AVATAR = 'user_avatar',
  PRODUCT_IMAGE = 'product_image',
}

// 存储决策规则
interface StorageRule {
  category: DataCategory;
  storageType: StorageType;
  maxSize?: number; // 最大文件大小（字节）
  allowedTypes?: string[]; // 允许的文件类型
  ttl?: number; // 生存时间（秒），仅用于Blob
  description: string;
}

// 存储规则配置
const STORAGE_RULES: StorageRule[] = [
  // 数据库存储规则
  {
    category: DataCategory.USER_INFO,
    storageType: StorageType.DATABASE,
    description: '用户基本信息：邮箱、姓名、计划类型',
  },
  {
    category: DataCategory.SUBSCRIPTION,
    storageType: StorageType.DATABASE,
    description: '订阅信息：状态、开始/结束日期',
  },
  {
    category: DataCategory.STORE_INFO,
    storageType: StorageType.DATABASE,
    description: 'Shopify店铺连接信息',
  },
  {
    category: DataCategory.MEMBER_INFO,
    storageType: StorageType.DATABASE,
    description: '会员信息：邮箱、姓名、状态',
  },
  {
    category: DataCategory.CAMPAIGN,
    storageType: StorageType.DATABASE,
    description: '活动信息：名称、状态、折扣配置',
  },
  {
    category: DataCategory.DISCOUNT_CODE,
    storageType: StorageType.DATABASE,
    description: '折扣码：代码、使用状态',
  },
  
  // Blob存储规则
  {
    category: DataCategory.CSV_IMPORT,
    storageType: StorageType.BLOB,
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['text/csv', 'application/vnd.ms-excel'],
    ttl: 24 * 60 * 60, // 24小时后自动删除
    description: 'CSV导入文件：临时存储，处理后删除',
  },
  {
    category: DataCategory.EMAIL_ATTACHMENT,
    storageType: StorageType.BLOB,
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    description: '邮件附件：图片、PDF等',
  },
  {
    category: DataCategory.BRAND_LOGO,
    storageType: StorageType.BLOB,
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/svg+xml'],
    description: '品牌Logo图片',
  },
  {
    category: DataCategory.BRAND_ASSETS,
    storageType: StorageType.BLOB,
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['text/css', 'application/json'],
    description: '品牌资源：CSS、配置文件',
  },
  {
    category: DataCategory.EXPORT_FILE,
    storageType: StorageType.BLOB,
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['text/csv', 'application/vnd.ms-excel', 'application/pdf'],
    ttl: 7 * 24 * 60 * 60, // 7天后自动删除
    description: '导出文件：会员列表、活动报告',
  },
  {
    category: DataCategory.USER_AVATAR,
    storageType: StorageType.BLOB,
    maxSize: 1 * 1024 * 1024, // 1MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    description: '用户头像',
  },
  {
    category: DataCategory.PRODUCT_IMAGE,
    storageType: StorageType.BLOB,
    maxSize: 3 * 1024 * 1024, // 3MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    description: '产品图片',
  },
];

/**
 * 智能存储决策器
 */
export class SmartStorageDecision {
  /**
   * 决定数据应该存储到哪里
   */
  static decide(category: DataCategory): StorageRule {
    const rule = STORAGE_RULES.find(r => r.category === category);
    if (!rule) {
      throw new Error(`No storage rule found for category: ${category}`);
    }
    return rule;
  }

  /**
   * 验证文件是否符合存储规则
   */
  static validate(
    category: DataCategory,
    file: { size: number; type: string }
  ): { valid: boolean; error?: string } {
    const rule = this.decide(category);

    // 检查文件大小
    if (rule.maxSize && file.size > rule.maxSize) {
      return {
        valid: false,
        error: `File size ${file.size} exceeds maximum ${rule.maxSize} bytes`,
      };
    }

    // 检查文件类型
    if (rule.allowedTypes && !rule.allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type ${file.type} not allowed. Allowed types: ${rule.allowedTypes.join(', ')}`,
      };
    }

    return { valid: true };
  }

  /**
   * 上传文件到Blob存储
   */
  static async uploadToBlob(
    category: DataCategory,
    file: File | Buffer,
    filename: string,
    userId?: string
  ): Promise<{ url: string; pathname: string }> {
    const rule = this.decide(category);

    if (rule.storageType !== StorageType.BLOB) {
      throw new Error(`Category ${category} should not be stored in Blob`);
    }

    // 构建存储路径
    const path = this.buildBlobPath(category, filename, userId);

    // 上传到Vercel Blob
    const blob = await put(path, file, {
      access: 'public',
      addRandomSuffix: true,
      ...(rule.ttl && { cacheControlMaxAge: rule.ttl }),
    });

    console.log(`[BLOB_UPLOAD] ${category}: ${blob.url}`);

    return {
      url: blob.url,
      pathname: blob.pathname,
    };
  }

  /**
   * 从Blob存储删除文件
   */
  static async deleteFromBlob(url: string): Promise<void> {
    await del(url);
    console.log(`[BLOB_DELETE] ${url}`);
  }

  /**
   * 列出Blob存储中的文件
   */
  static async listBlobFiles(prefix?: string) {
    const { blobs } = await list({ prefix });
    return blobs;
  }

  /**
   * 构建Blob存储路径
   */
  private static buildBlobPath(
    category: DataCategory,
    filename: string,
    userId?: string
  ): string {
    const timestamp = Date.now();
    const parts: string[] = [category];

    if (userId) {
      parts.push(userId);
    }

    parts.push(`${timestamp}-${filename}`);

    return parts.join('/');
  }

  /**
   * 获取所有存储规则（用于文档和UI）
   */
  static getAllRules(): StorageRule[] {
    return STORAGE_RULES;
  }

  /**
   * 获取数据库存储规则
   */
  static getDatabaseRules(): StorageRule[] {
    return STORAGE_RULES.filter(r => r.storageType === StorageType.DATABASE);
  }

  /**
   * 获取Blob存储规则
   */
  static getBlobRules(): StorageRule[] {
    return STORAGE_RULES.filter(r => r.storageType === StorageType.BLOB);
  }
}

/**
 * 便捷函数：上传CSV导入文件
 */
export async function uploadCSVImport(file: File, userId: string) {
  const validation = SmartStorageDecision.validate(DataCategory.CSV_IMPORT, {
    size: file.size,
    type: file.type,
  });

  if (!validation.valid) {
    throw new Error(validation.error);
  }

  return await SmartStorageDecision.uploadToBlob(
    DataCategory.CSV_IMPORT,
    file,
    file.name,
    userId
  );
}

/**
 * 便捷函数：上传用户头像
 */
export async function uploadUserAvatar(file: File, userId: string) {
  const validation = SmartStorageDecision.validate(DataCategory.USER_AVATAR, {
    size: file.size,
    type: file.type,
  });

  if (!validation.valid) {
    throw new Error(validation.error);
  }

  return await SmartStorageDecision.uploadToBlob(
    DataCategory.USER_AVATAR,
    file,
    file.name,
    userId
  );
}

/**
 * 便捷函数：上传品牌Logo
 */
export async function uploadBrandLogo(file: File, storeId: string) {
  const validation = SmartStorageDecision.validate(DataCategory.BRAND_LOGO, {
    size: file.size,
    type: file.type,
  });

  if (!validation.valid) {
    throw new Error(validation.error);
  }

  return await SmartStorageDecision.uploadToBlob(
    DataCategory.BRAND_LOGO,
    file,
    file.name,
    storeId
  );
}

/**
 * 便捷函数：导出会员列表到CSV
 */
export async function exportMembersToCSV(csvContent: string, userId: string) {
  const buffer = Buffer.from(csvContent, 'utf-8');
  const filename = `members-export-${Date.now()}.csv`;

  return await SmartStorageDecision.uploadToBlob(
    DataCategory.EXPORT_FILE,
    buffer,
    filename,
    userId
  );
}

