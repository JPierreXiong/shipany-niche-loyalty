/**
 * 客户配置向导 - 简化版
 * 展示 Webhook URL 并提供一键复制功能
 */

'use client';

import { useState, useEffect } from 'react';
import { Copy, Check, ExternalLink, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { toast } from 'sonner';

export default function WebhookConfigGuide() {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [shopDomain, setShopDomain] = useState('');
  const [status, setStatus] = useState<'pending' | 'active' | 'loading'>('loading');
  const [copied, setCopied] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    fetchWebhookInfo();
  }, []);

  async function fetchWebhookInfo() {
    try {
      const response = await fetch('/api/niche-loyalty/webhook-info');
      if (response.ok) {
        const data = await response.json();
        setWebhookUrl(data.data.webhookUrl);
        setShopDomain(data.data.shopDomain || '');
        setStatus(data.data.shopDomain ? 'active' : 'pending');
      }
    } catch (error) {
      console.error('Failed to fetch webhook info:', error);
      setStatus('pending');
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    toast.success('Webhook URL copied!');
    setTimeout(() => setCopied(false), 2000);
  }

  async function checkStatus() {
    setChecking(true);
    await fetchWebhookInfo();
    setChecking(false);
    
    if (shopDomain) {
      toast.success(`Connected to ${shopDomain}!`);
    } else {
      toast.info('Waiting for first webhook from Shopify...');
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* 状态卡片 */}
      <div className={`rounded-lg p-6 ${
        status === 'active' 
          ? 'bg-green-50 border-2 border-green-200' 
          : 'bg-yellow-50 border-2 border-yellow-200'
      }`}>
        <div className="flex items-start gap-4">
          {status === 'active' ? (
            <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
          ) : (
            <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
          )}
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">
              {status === 'active' ? '✅ Connected' : '⏳ Waiting for Activation'}
            </h3>
            {status === 'active' ? (
              <p className="text-sm text-gray-700">
                Your store <code className="bg-green-100 px-2 py-0.5 rounded font-mono text-xs">{shopDomain}</code> is connected and tracking orders.
              </p>
            ) : (
              <p className="text-sm text-gray-700">
                Configure the webhook in Shopify to activate automatic order tracking.
              </p>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={checkStatus}
            disabled={checking}
          >
            {checking ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Webhook URL 卡片 */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Your Webhook URL</h3>
        <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <code className="flex-1 text-sm font-mono text-blue-600 break-all">
            {webhookUrl || 'Loading...'}
          </code>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            disabled={!webhookUrl}
            className="flex-shrink-0"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* 配置步骤 */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Configuration Steps</h3>
        
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
              1
            </div>
            <div className="flex-1">
              <p className="font-medium">Go to Shopify Admin</p>
              <p className="text-sm text-gray-600 mt-1">
                Navigate to: <strong>Settings → Notifications</strong>
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
              2
            </div>
            <div className="flex-1">
              <p className="font-medium">Create Webhook</p>
              <p className="text-sm text-gray-600 mt-1">
                Scroll to <strong>Webhooks</strong> section, click <strong>Create webhook</strong>
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
              3
            </div>
            <div className="flex-1">
              <p className="font-medium">Configure Settings</p>
              <div className="mt-2 space-y-2 bg-gray-50 p-3 rounded border border-gray-200 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Event:</span>
                  <span className="font-mono font-semibold">Order payment</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Format:</span>
                  <span className="font-mono font-semibold">JSON</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-600">URL:</span>
                  <code className="font-mono text-xs text-blue-600 break-all bg-white p-2 rounded border border-gray-200">
                    {webhookUrl}
                  </code>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
              4
            </div>
            <div className="flex-1">
              <p className="font-medium">Save & Test</p>
              <p className="text-sm text-gray-600 mt-1">
                Click <strong>Save webhook</strong>, then click <strong>Send test notification</strong> to activate
              </p>
            </div>
          </div>
        </div>

        <Button
          className="w-full mt-6"
          onClick={() => window.open('https://admin.shopify.com/settings/notifications', '_blank')}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Open Shopify Admin
        </Button>
      </div>

      {/* 提示卡片 */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
        <p className="text-sm text-blue-900">
          <strong>💡 Pro Tip:</strong> After saving the webhook in Shopify, click "Send test notification" 
          to immediately activate the connection. Your shop domain will be automatically detected!
        </p>
      </div>
    </div>
  );
}

