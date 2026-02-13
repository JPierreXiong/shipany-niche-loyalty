/**
 * Customers Page
 * Manage loyalty program members
 */

'use client';

import { useEffect, useState } from 'react';
import { Plus, Upload, RefreshCw } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { AddCustomerDialog } from './components/AddCustomerDialog';
import { ImportMembersDialog } from '../dashboard/components/ImportMembersDialog';
import { toast } from 'sonner';

interface Customer {
  id: string;
  email: string;
  name: string | null;
  source: string;
  status: string;
  joinedAt: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    try {
      const response = await fetch('/api/niche-loyalty/members/list');
      if (response.ok) {
        const data = await response.json();
        setCustomers(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  }

  async function syncFromShopify() {
    toast.info('Syncing customers from Shopify...');
    try {
      const response = await fetch('/api/niche-loyalty/members/sync', {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Synced ${data.data.synced} customers from Shopify`);
        fetchCustomers();
      } else {
        toast.error('Failed to sync customers');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  }

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'import':
        return 'Manual Import';
      case 'shopify_sync':
        return 'Shopify Sync';
      case 'manual':
        return 'Manual Entry';
      default:
        return source;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 rounded bg-gray-200"></div>
            <div className="h-64 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Spacer for Header */}
        <div className="h-20" />
        
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
            <p className="mt-2 text-gray-600">
              Manage your loyalty program members
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={syncFromShopify}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync from Shopify
            </Button>
            <Button variant="outline" onClick={() => setImportDialogOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Import CSV
            </Button>
            <Button onClick={() => setAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </div>
        </div>

        {/* Customers List */}
        {customers.length === 0 ? (
          <div className="rounded-lg bg-white p-12 text-center shadow">
            <div className="mx-auto h-24 w-24 rounded-full bg-gray-100 p-6">
              <Plus className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              No customers yet
            </h3>
            <p className="mt-2 text-gray-600">
              Add customers manually or sync from Shopify
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button onClick={() => setAddDialogOpen(true)}>
                Add Your First Customer
              </Button>
              <Button variant="outline" onClick={syncFromShopify}>
                Sync from Shopify
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {customer.email}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {customer.name || '-'}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {getSourceLabel(customer.source)}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {new Date(customer.joinedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          customer.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {customer.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddCustomerDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
      <ImportMembersDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
      />
    </div>
  );
}

