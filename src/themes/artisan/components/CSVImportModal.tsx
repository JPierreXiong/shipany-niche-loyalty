/**
 * CSV Import Modal - 会员批量导入
 * 设计理念: 拖拽上传 + 实时验证 + 温度感反馈
 */

'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Check, AlertCircle, Download, Users } from 'lucide-react';

interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (members: any[]) => Promise<void>;
}

export function CSVImportModal({ isOpen, onClose, onImport }: CSVImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理文件选择
  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // 验证文件类型
    if (!selectedFile.name.endsWith('.csv')) {
      setErrors(['Please upload a CSV file']);
      return;
    }

    setFile(selectedFile);
    setErrors([]);

    // 解析 CSV
    const text = await selectedFile.text();
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      setErrors(['CSV file is empty or invalid']);
      return;
    }

    // 解析表头
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    // 验证必需的列
    if (!headers.includes('name') || !headers.includes('email')) {
      setErrors(['CSV must contain "name" and "email" columns']);
      return;
    }

    // 解析数据
    const members = lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.trim());
      const member: any = {};
      
      headers.forEach((header, i) => {
        member[header] = values[i] || '';
      });

      return {
        ...member,
        points: parseInt(member.points) || 0,
        tier: member.tier || 'bronze',
        rowNumber: index + 2, // +2 因为有表头和从1开始
      };
    });

    setPreview(members.slice(0, 5)); // 只显示前5条预览
  };

  // 处理导入
  const handleImport = async () => {
    if (!file || preview.length === 0) return;

    setIsUploading(true);

    try {
      // 读取完整文件
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const members = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const member: any = {};
        
        headers.forEach((header, i) => {
          member[header] = values[i] || '';
        });

        return {
          name: member.name,
          email: member.email,
          points: parseInt(member.points) || 0,
          tier: member.tier || 'bronze',
        };
      });

      await onImport(members);
      
      // 触感反馈
      if ('vibrate' in navigator) {
        navigator.vibrate(15);
      }

      // 关闭模态框
      setTimeout(() => {
        onClose();
        setFile(null);
        setPreview([]);
      }, 1000);
    } catch (error) {
      setErrors(['Failed to import members. Please try again.']);
    } finally {
      setIsUploading(false);
    }
  };

  // 下载模板
  const downloadTemplate = () => {
    const template = 'name,email,points,tier\nJohn Doe,john@example.com,100,bronze\nJane Smith,jane@example.com,250,silver';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'members-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-stone-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-stone-600" />
              </div>
              <div>
                <h2 className="text-xl font-medium text-stone-800">Import Members</h2>
                <p className="text-sm text-stone-500">Upload a CSV file to add members in bulk</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-stone-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Download Template */}
            <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-stone-800">Need a template?</p>
                <p className="text-xs text-stone-500">Download our CSV template to get started</p>
              </div>
              <button
                onClick={downloadTemplate}
                className="artisan-button-secondary text-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
            </div>

            {/* Upload Area */}
            {!file ? (
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-48 border-2 border-dashed border-stone-300 rounded-2xl flex flex-col items-center justify-center space-y-3 hover:border-stone-400 hover:bg-stone-50 transition-colors"
              >
                <Upload className="w-12 h-12 text-stone-400" />
                <div className="text-center">
                  <p className="text-sm font-medium text-stone-800">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-stone-500">CSV files only</p>
                </div>
              </motion.button>
            ) : (
              <div className="space-y-4">
                {/* File Info */}
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-stone-800">{file.name}</p>
                      <p className="text-xs text-stone-500">
                        {preview.length} members ready to import
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setFile(null);
                      setPreview([]);
                      setErrors([]);
                    }}
                    className="text-sm text-stone-600 hover:text-stone-800"
                  >
                    Remove
                  </button>
                </div>

                {/* Preview */}
                {preview.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-stone-800">Preview (first 5 rows)</p>
                    <div className="border border-stone-200 rounded-xl overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-stone-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-stone-600">Name</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-stone-600">Email</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-stone-600">Points</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-stone-600">Tier</th>
                          </tr>
                        </thead>
                        <tbody>
                          {preview.map((member, index) => (
                            <tr key={index} className="border-t border-stone-100">
                              <td className="px-4 py-2 text-stone-800">{member.name}</td>
                              <td className="px-4 py-2 text-stone-600">{member.email}</td>
                              <td className="px-4 py-2 text-stone-600">{member.points}</td>
                              <td className="px-4 py-2">
                                <span className="artisan-badge text-xs">{member.tier}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Errors */}
            {errors.length > 0 && (
              <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-800 mb-1">Import errors</p>
                    <ul className="text-xs text-red-600 space-y-1">
                      {errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-stone-200 bg-stone-50">
            <button
              onClick={onClose}
              className="artisan-button-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={!file || preview.length === 0 || isUploading}
              className="artisan-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Importing...' : `Import ${preview.length} Members`}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
















