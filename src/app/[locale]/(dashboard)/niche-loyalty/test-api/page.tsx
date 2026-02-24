/**
 * API Test Page
 * Test if Shopify APIs are accessible
 */

'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';

export default function TestAPIPage() {
  const [results, setResults] = useState<any>({});
  const [testing, setTesting] = useState(false);

  async function testAPIs() {
    setTesting(true);
    const tests: any = {};

    // Test 1: Check if verify endpoint exists
    try {
      const res = await fetch('/api/niche-loyalty/shopify/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: 'test',
          clientSecret: 'test',
          accessToken: 'test',
          webhookSecret: 'test',
        }),
      });
      tests.verify = {
        status: res.status,
        ok: res.ok,
        statusText: res.statusText,
      };
    } catch (error: any) {
      tests.verify = { error: error.message };
    }

    // Test 2: Check other endpoints
    try {
      const res = await fetch('/api/niche-loyalty/shopify/check-connection');
      tests.checkConnection = {
        status: res.status,
        ok: res.ok,
      };
    } catch (error: any) {
      tests.checkConnection = { error: error.message };
    }

    // Test 3: Check config endpoint
    try {
      const res = await fetch('/api/niche-loyalty/config');
      tests.config = {
        status: res.status,
        ok: res.ok,
      };
    } catch (error: any) {
      tests.config = { error: error.message };
    }

    setResults(tests);
    setTesting(false);
  }

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold">API Connectivity Test</h1>
        <p className="mt-2 text-gray-600">
          Test if Shopify integration APIs are accessible
        </p>

        <Button onClick={testAPIs} disabled={testing} className="mt-6">
          {testing ? 'Testing...' : 'Run Tests'}
        </Button>

        {Object.keys(results).length > 0 && (
          <div className="mt-8 space-y-4">
            {Object.entries(results).map(([key, value]: [string, any]) => (
              <div key={key} className="rounded-lg border p-4">
                <h3 className="font-semibold">{key}</h3>
                <pre className="mt-2 overflow-auto text-xs">
                  {JSON.stringify(value, null, 2)}
                </pre>
                <div className="mt-2">
                  {value.status === 404 && (
                    <p className="text-red-600">❌ API endpoint not found (404)</p>
                  )}
                  {value.status === 401 && (
                    <p className="text-yellow-600">⚠️ Authentication required (401)</p>
                  )}
                  {value.status === 400 && (
                    <p className="text-yellow-600">⚠️ Bad request - API exists but validation failed (400)</p>
                  )}
                  {value.status === 200 && (
                    <p className="text-green-600">✅ API accessible (200)</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 rounded-lg bg-blue-50 p-6">
          <h2 className="font-semibold text-blue-900">Expected Results:</h2>
          <ul className="mt-2 space-y-1 text-sm text-blue-800">
            <li>• <strong>verify</strong>: Should return 400 or 401 (not 404)</li>
            <li>• <strong>checkConnection</strong>: Should return 401 (not 404)</li>
            <li>• <strong>config</strong>: Should return 200 or 401 (not 404)</li>
          </ul>
          <p className="mt-4 text-sm text-blue-900">
            If you see 404 errors, the API routes are not deployed correctly.
          </p>
        </div>
      </div>
    </div>
  );
}

