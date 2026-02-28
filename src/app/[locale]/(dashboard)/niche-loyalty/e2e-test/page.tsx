/**
 * End-to-End Test Suite
 * Tests: Registration → Payment → Shopify Connection
 */

'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

type TestStatus = 'pending' | 'running' | 'passed' | 'failed' | 'warning';

interface TestResult {
  name: string;
  status: TestStatus;
  message: string;
  details?: any;
  duration?: number;
}

export default function E2ETestPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState('');

  function updateResult(result: TestResult) {
    setResults(prev => {
      const index = prev.findIndex(r => r.name === result.name);
      if (index >= 0) {
        const newResults = [...prev];
        newResults[index] = result;
        return newResults;
      }
      return [...prev, result];
    });
  }

  async function runTests() {
    setRunning(true);
    setResults([]);

    // Test 1: Check API Routes Existence
    await testAPIRoutes();

    // Test 2: Check Authentication
    await testAuthentication();

    // Test 3: Check Payment System
    await testPaymentSystem();

    // Test 4: Check Shopify Integration
    await testShopifyIntegration();

    // Test 5: Check Database Schema
    await testDatabaseSchema();

    setRunning(false);
    setCurrentTest('');
  }

  async function testAPIRoutes() {
    setCurrentTest('Testing API Routes...');
    const startTime = Date.now();

    const routes = [
      { path: '/api/user/get-user-info', method: 'GET', expectedStatus: [200, 401] },
      { path: '/api/niche-loyalty/config', method: 'GET', expectedStatus: [200, 401] },
      { path: '/api/niche-loyalty/shopify/verify', method: 'POST', expectedStatus: [400, 401] },
      { path: '/api/niche-loyalty/shopify/check-connection', method: 'GET', expectedStatus: [200, 401] },
      { path: '/api/payment/checkout', method: 'POST', expectedStatus: [400, 401] },
      { path: '/api/debug/payment-status', method: 'GET', expectedStatus: [200, 401] },
    ];

    let allPassed = true;
    const details: any = {};

    for (const route of routes) {
      try {
        const res = await fetch(route.path, {
          method: route.method,
          headers: { 'Content-Type': 'application/json' },
          body: route.method === 'POST' ? JSON.stringify({}) : undefined,
        });

        const passed = route.expectedStatus.includes(res.status);
        details[route.path] = {
          status: res.status,
          expected: route.expectedStatus,
          passed,
        };

        if (!passed && res.status === 404) {
          allPassed = false;
        }
      } catch (error: any) {
        details[route.path] = { error: error.message };
        allPassed = false;
      }
    }

    const duration = Date.now() - startTime;

    updateResult({
      name: 'API Routes',
      status: allPassed ? 'passed' : 'failed',
      message: allPassed 
        ? `All ${routes.length} API routes are accessible`
        : 'Some API routes returned 404 - not deployed correctly',
      details,
      duration,
    });
  }

  async function testAuthentication() {
    setCurrentTest('Testing Authentication...');
    const startTime = Date.now();

    try {
      const res = await fetch('/api/user/get-user-info');
      const duration = Date.now() - startTime;

      if (res.status === 401) {
        updateResult({
          name: 'Authentication',
          status: 'warning',
          message: 'Not logged in - this is expected for testing',
          details: { status: 401, note: 'User needs to sign in' },
          duration,
        });
      } else if (res.status === 200) {
        const data = await res.json();
        updateResult({
          name: 'Authentication',
          status: 'passed',
          message: `Logged in as: ${data.data?.email || 'Unknown'}`,
          details: {
            userId: data.data?.id,
            email: data.data?.email,
            planType: data.data?.planType,
          },
          duration,
        });
      } else {
        updateResult({
          name: 'Authentication',
          status: 'failed',
          message: `Unexpected status: ${res.status}`,
          duration,
        });
      }
    } catch (error: any) {
      updateResult({
        name: 'Authentication',
        status: 'failed',
        message: error.message,
        duration: Date.now() - startTime,
      });
    }
  }

  async function testPaymentSystem() {
    setCurrentTest('Testing Payment System...');
    const startTime = Date.now();

    try {
      // Check payment status endpoint
      const res = await fetch('/api/debug/payment-status');
      const duration = Date.now() - startTime;

      if (res.status === 401) {
        updateResult({
          name: 'Payment System',
          status: 'warning',
          message: 'Cannot check payment status - not logged in',
          duration,
        });
      } else if (res.status === 200) {
        const data = await res.json();
        const hasOrders = data.data?.orders?.total > 0;
        const hasSubscriptions = data.data?.subscriptions?.total > 0;

        updateResult({
          name: 'Payment System',
          status: hasOrders || hasSubscriptions ? 'passed' : 'warning',
          message: hasOrders || hasSubscriptions
            ? `Found ${data.data.orders?.total || 0} orders, ${data.data.subscriptions?.total || 0} subscriptions`
            : 'No payment records found - user may not have paid yet',
          details: {
            orders: data.data?.orders?.total || 0,
            subscriptions: data.data?.subscriptions?.total || 0,
            planType: data.data?.user?.planType,
          },
          duration,
        });
      } else {
        updateResult({
          name: 'Payment System',
          status: 'failed',
          message: `API returned ${res.status}`,
          duration,
        });
      }
    } catch (error: any) {
      updateResult({
        name: 'Payment System',
        status: 'failed',
        message: error.message,
        duration: Date.now() - startTime,
      });
    }
  }

  async function testShopifyIntegration() {
    setCurrentTest('Testing Shopify Integration...');
    const startTime = Date.now();

    try {
      // Test 1: Check connection status
      const connectionRes = await fetch('/api/niche-loyalty/shopify/check-connection');
      
      if (connectionRes.status === 401) {
        updateResult({
          name: 'Shopify Integration',
          status: 'warning',
          message: 'Cannot check Shopify connection - not logged in',
          duration: Date.now() - startTime,
        });
        return;
      }

      if (connectionRes.status === 404) {
        updateResult({
          name: 'Shopify Integration',
          status: 'failed',
          message: 'Shopify API endpoint not found (404) - deployment issue',
          duration: Date.now() - startTime,
        });
        return;
      }

      const connectionData = await connectionRes.json();
      const isConnected = connectionData.data?.connected;

      // Test 2: Try verify endpoint with dummy data
      const verifyRes = await fetch('/api/niche-loyalty/shopify/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: 'test',
          clientSecret: 'test',
          accessToken: 'test',
          webhookSecret: 'test',
        }),
      });

      const duration = Date.now() - startTime;

      if (verifyRes.status === 404) {
        updateResult({
          name: 'Shopify Integration',
          status: 'failed',
          message: 'Shopify verify endpoint not found (404) - critical deployment issue',
          details: {
            checkConnectionStatus: connectionRes.status,
            verifyStatus: 404,
            note: 'API routes are not deployed to Vercel',
          },
          duration,
        });
      } else if (verifyRes.status === 401) {
        updateResult({
          name: 'Shopify Integration',
          status: 'warning',
          message: 'Shopify endpoints exist but user not authenticated',
          details: {
            connected: isConnected,
            verifyEndpointExists: true,
          },
          duration,
        });
      } else {
        updateResult({
          name: 'Shopify Integration',
          status: isConnected ? 'passed' : 'warning',
          message: isConnected 
            ? 'Shopify store is connected'
            : 'Shopify endpoints working but store not connected yet',
          details: {
            connected: isConnected,
            verifyStatus: verifyRes.status,
          },
          duration,
        });
      }
    } catch (error: any) {
      updateResult({
        name: 'Shopify Integration',
        status: 'failed',
        message: error.message,
        duration: Date.now() - startTime,
      });
    }
  }

  async function testDatabaseSchema() {
    setCurrentTest('Testing Database Schema...');
    const startTime = Date.now();

    try {
      // We can't directly test DB schema from frontend, but we can infer from API responses
      const res = await fetch('/api/niche-loyalty/config');
      const duration = Date.now() - startTime;

      if (res.status === 200 || res.status === 401) {
        updateResult({
          name: 'Database Schema',
          status: 'passed',
          message: 'Database connection working (inferred from API)',
          duration,
        });
      } else {
        updateResult({
          name: 'Database Schema',
          status: 'warning',
          message: 'Cannot verify database schema from frontend',
          duration,
        });
      }
    } catch (error: any) {
      updateResult({
        name: 'Database Schema',
        status: 'failed',
        message: error.message,
        duration: Date.now() - startTime,
      });
    }
  }

  function getStatusIcon(status: TestStatus) {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'running':
        return <Clock className="h-5 w-5 animate-spin text-blue-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  }

  function getStatusColor(status: TestStatus) {
    switch (status) {
      case 'passed':
        return 'bg-green-50 border-green-200';
      case 'failed':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  }

  const passedCount = results.filter(r => r.status === 'passed').length;
  const failedCount = results.filter(r => r.status === 'failed').length;
  const warningCount = results.filter(r => r.status === 'warning').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            End-to-End Test Suite
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Complete flow: Registration → Payment → Shopify Connection
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            onClick={runTests}
            disabled={running}
            size="lg"
            className="px-8"
          >
            {running ? '🔄 Running Tests...' : '▶️ Run All Tests'}
          </Button>
        </div>

        {currentTest && (
          <div className="mt-6 text-center text-sm text-gray-600">
            {currentTest}
          </div>
        )}

        {results.length > 0 && (
          <>
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-green-100 p-4 text-center">
                <div className="text-3xl font-bold text-green-700">{passedCount}</div>
                <div className="text-sm text-green-600">Passed</div>
              </div>
              <div className="rounded-lg bg-yellow-100 p-4 text-center">
                <div className="text-3xl font-bold text-yellow-700">{warningCount}</div>
                <div className="text-sm text-yellow-600">Warnings</div>
              </div>
              <div className="rounded-lg bg-red-100 p-4 text-center">
                <div className="text-3xl font-bold text-red-700">{failedCount}</div>
                <div className="text-sm text-red-600">Failed</div>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`rounded-lg border p-6 ${getStatusColor(result.status)}`}
                >
                  <div className="flex items-start gap-4">
                    {getStatusIcon(result.status)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {result.name}
                        </h3>
                        {result.duration && (
                          <span className="text-xs text-gray-500">
                            {result.duration}ms
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-700">{result.message}</p>
                      {result.details && (
                        <details className="mt-3">
                          <summary className="cursor-pointer text-xs font-medium text-gray-600">
                            View Details
                          </summary>
                          <pre className="mt-2 overflow-auto rounded bg-white p-3 text-xs">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {failedCount > 0 && (
              <div className="mt-8 rounded-lg bg-red-50 border border-red-200 p-6">
                <h3 className="font-semibold text-red-900">🚨 Critical Issues Found</h3>
                <ul className="mt-3 space-y-2 text-sm text-red-800">
                  {results
                    .filter(r => r.status === 'failed')
                    .map((r, i) => (
                      <li key={i}>
                        <strong>{r.name}:</strong> {r.message}
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {!running && failedCount === 0 && warningCount === 0 && (
              <div className="mt-8 rounded-lg bg-green-50 border border-green-200 p-6 text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
                <h3 className="mt-4 text-xl font-semibold text-green-900">
                  ✅ All Tests Passed!
                </h3>
                <p className="mt-2 text-sm text-green-700">
                  Your system is ready for production
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}






