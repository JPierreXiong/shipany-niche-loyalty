/**
 * Settings Page
 * Configure loyalty program settings
 */

'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { ShopifySettings } from './components/ShopifySettings';
import { BrandSettings } from './components/BrandSettings';
import { EmailSettings } from './components/EmailSettings';
import { BillingSettings } from './components/BillingSettings';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('shopify');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-600">
            Configure your loyalty program
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="shopify">Shopify</TabsTrigger>
            <TabsTrigger value="brand">Brand</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="shopify">
            <ShopifySettings />
          </TabsContent>

          <TabsContent value="brand">
            <BrandSettings />
          </TabsContent>

          <TabsContent value="email">
            <EmailSettings />
          </TabsContent>

          <TabsContent value="billing">
            <BillingSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

