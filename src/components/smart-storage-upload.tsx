/**
 * Smart Storage Upload Component
 * 智能存储上传组件示例
 */

'use client';

import { useState } from 'react';
import { DataCategory } from '@/shared/lib/smart-storage';

interface UploadResult {
  url: string;
  pathname: string;
  category: string;
  storageType: string;
  description: string;
}

export function SmartStorageUpload() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (
    file: File,
    category: DataCategory,
    storeId?: string
  ) => {
    setUploading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);
      if (storeId) {
        formData.append('storeId', storeId);
      }

      const response = await fetch('/api/storage', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setResult(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    category: DataCategory
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleUpload(file, category);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">智能存储上传示例</h2>

      {/* CSV导入 */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-2">CSV会员导入</h3>
        <p className="text-sm text-gray-600 mb-3">
          自动存储到Blob，24小时后自动删除
        </p>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => handleFileChange(e, DataCategory.CSV_IMPORT)}
          disabled={uploading}
          className="block w-full text-sm"
        />
      </div>

      {/* 用户头像 */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-2">用户头像</h3>
        <p className="text-sm text-gray-600 mb-3">
          自动存储到Blob，最大1MB
        </p>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => handleFileChange(e, DataCategory.USER_AVATAR)}
          disabled={uploading}
          className="block w-full text-sm"
        />
      </div>

      {/* 品牌Logo */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-2">品牌Logo</h3>
        <p className="text-sm text-gray-600 mb-3">
          自动存储到Blob，支持SVG
        </p>
        <input
          type="file"
          accept="image/jpeg,image/png,image/svg+xml"
          onChange={(e) => handleFileChange(e, DataCategory.BRAND_LOGO)}
          disabled={uploading}
          className="block w-full text-sm"
        />
      </div>

      {/* 上传状态 */}
      {uploading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800">上传中...</p>
        </div>
      )}

      {/* 错误信息 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">错误: {error}</p>
        </div>
      )}

      {/* 上传结果 */}
      {result && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-2">上传成功！</h3>
          <div className="space-y-2 text-sm">
            <p><strong>存储类型:</strong> {result.storageType}</p>
            <p><strong>分类:</strong> {result.category}</p>
            <p><strong>说明:</strong> {result.description}</p>
            <p><strong>URL:</strong> <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{result.url}</a></p>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * 使用示例：CSV导入处理
 */
export async function processCSVImport(file: File, userId: string) {
  // 1. 上传到Blob
  const formData = new FormData();
  formData.append('file', file);
  formData.append('category', DataCategory.CSV_IMPORT);

  const uploadResponse = await fetch('/api/storage', {
    method: 'POST',
    body: formData,
  });

  const { data } = await uploadResponse.json();
  const csvUrl = data.url;

  // 2. 下载并解析CSV
  const csvResponse = await fetch(csvUrl);
  const csvText = await csvResponse.text();
  const rows = csvText.split('\n').map(row => row.split(','));

  // 3. 处理数据并存储到数据库
  const members = rows.slice(1).map(row => ({
    email: row[0],
    name: row[1],
    status: row[2],
  }));

  // 存储到数据库（这里是示例）
  await fetch('/api/loyalty/members/bulk-import', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ members }),
  });

  // 4. 删除临时文件（可选，因为有TTL）
  await fetch(`/api/storage?url=${encodeURIComponent(csvUrl)}`, {
    method: 'DELETE',
  });

  return { success: true, count: members.length };
}

/**
 * 使用示例：导出会员列表
 */
export async function exportMembers(storeId: string) {
  // 1. 从数据库获取会员数据
  const response = await fetch(`/api/loyalty/members?storeId=${storeId}`);
  const { members } = await response.json();

  // 2. 生成CSV内容
  const headers = ['Email', 'Name', 'Status', 'Points'];
  const rows = members.map((m: any) => [m.email, m.name, m.status, m.points]);
  const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');

  // 3. 上传到Blob
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const file = new File([blob], `members-${Date.now()}.csv`, { type: 'text/csv' });

  const formData = new FormData();
  formData.append('file', file);
  formData.append('category', DataCategory.EXPORT_FILE);

  const uploadResponse = await fetch('/api/storage', {
    method: 'POST',
    body: formData,
  });

  const { data } = await uploadResponse.json();
  
  // 4. 返回下载链接（7天后自动删除）
  return data.url;
}









