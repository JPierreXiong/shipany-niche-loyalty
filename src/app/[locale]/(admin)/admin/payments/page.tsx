import { getTranslations, setRequestLocale } from 'next-intl/server';

import { PERMISSIONS, requirePermission } from '@/core/rbac';
import { PaymentType } from '@/extensions/payment';
import { Header, Main, MainHeader } from '@/shared/blocks/dashboard';
import { TableCard } from '@/shared/blocks/table';
import { getOrders, getOrdersCount, OrderStatus } from '@/shared/models/order';
import { Crumb, Filter, Search, Tab } from '@/shared/types/blocks/common';
import { type Table } from '@/shared/types/blocks/table';
import { DollarSign, CreditCard, TrendingUp, Users } from 'lucide-react';

export default async function PaymentsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    page?: number;
    pageSize?: number;
    type?: string;
    status?: string;
    provider?: string;
    orderNo?: string;
  }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Check if user has permission to read payments
  await requirePermission({
    code: PERMISSIONS.PAYMENTS_READ,
    redirectUrl: '/admin/no-permission',
    locale,
  });

  const t = await getTranslations('admin.payments');

  const {
    page: pageNum,
    pageSize,
    type,
    status,
    provider,
    orderNo,
  } = await searchParams;
  const page = pageNum || 1;
  const limit = pageSize || 30;

  const crumbs: Crumb[] = [
    { title: t('list.crumbs.admin'), url: '/admin' },
    { title: t('list.crumbs.payments'), is_active: true },
  ];

  const tabs: Tab[] = [
    {
      name: 'all',
      title: t('list.tabs.all'),
      url: '/admin/payments',
      is_active: !type || type === 'all',
    },
    {
      name: 'subscription',
      title: t('list.tabs.subscription'),
      url: '/admin/payments?type=subscription',
      is_active: type === 'subscription',
    },
    {
      name: 'one-time',
      title: t('list.tabs.one-time'),
      url: '/admin/payments?type=one-time',
      is_active: type === 'one-time',
    },
  ];

  const filters: Filter[] = [
    {
      name: 'status',
      title: t('list.filters.status.title'),
      value: status,
      options: [
        { value: 'all', label: t('list.filters.status.options.all') },
        {
          value: OrderStatus.PAID,
          label: t('list.filters.status.options.paid'),
        },
        {
          value: OrderStatus.CREATED,
          label: t('list.filters.status.options.created'),
        },
        {
          value: OrderStatus.FAILED,
          label: t('list.filters.status.options.failed'),
        },
      ],
    },
    {
      name: 'provider',
      title: t('list.filters.provider.title'),
      value: provider,
      options: [
        { value: 'all', label: t('list.filters.provider.options.all') },
        {
          value: 'stripe',
          label: t('list.filters.provider.options.stripe'),
        },
        {
          value: 'creem',
          label: t('list.filters.provider.options.creem'),
        },
        {
          value: 'lemonsqueezy',
          label: t('list.filters.provider.options.lemonsqueezy'),
        },
        {
          value: 'paypal',
          label: t('list.filters.provider.options.paypal'),
        },
      ],
    },
  ];

  const search: Search = {
    name: 'orderNo',
    title: t('list.search.order_no.title'),
    placeholder: t('list.search.order_no.placeholder'),
    value: orderNo,
  };

  const total = await getOrdersCount({
    orderNo: orderNo ? (orderNo as string) : undefined,
    paymentType: type as PaymentType,
    paymentProvider:
      provider && provider !== 'all' ? (provider as string) : undefined,
    status: status && status !== 'all' ? (status as OrderStatus) : undefined,
  });

  const payments = await getOrders({
    orderNo: orderNo ? (orderNo as string) : undefined,
    paymentType: type as PaymentType,
    paymentProvider:
      provider && provider !== 'all' ? (provider as string) : undefined,
    status: status && status !== 'all' ? (status as OrderStatus) : undefined,
    getUser: true,
    page,
    limit,
  });

  // Calculate summary statistics
  const allPaidOrders = await getOrders({
    status: OrderStatus.PAID,
    getUser: false,
    page: 1,
    limit: 10000, // Get all paid orders for statistics
  });

  const totalRevenue = allPaidOrders.reduce((sum, order) => sum + (order.paymentAmount || order.amount || 0), 0);
  const subscriptionOrders = allPaidOrders.filter(o => o.paymentType === PaymentType.SUBSCRIPTION);
  const oneTimeOrders = allPaidOrders.filter(o => o.paymentType !== PaymentType.SUBSCRIPTION);
  const uniqueCustomers = new Set(allPaidOrders.map(o => o.userId)).size;

  const table: Table = {
    columns: [
      { name: 'orderNo', title: t('fields.order_no'), type: 'copy' },
      { name: 'user', title: t('fields.user'), type: 'user' },
      {
        title: t('fields.amount'),
        callback: (item) => {
          return (
            <div className="text-primary">{`${item.amount / 100} ${
              item.currency
            }`}</div>
          );
        },
        type: 'copy',
      },
      { name: 'status', title: t('fields.status'), type: 'label' },
      {
        name: 'paymentType',
        title: t('fields.type'),
        type: 'label',
        placeholder: '-',
      },
      {
        name: 'productId',
        title: t('fields.product'),
        type: 'label',
        placeholder: '-',
      },
      { name: 'description', title: t('fields.description'), placeholder: '-' },
      {
        name: 'paymentProvider',
        title: t('fields.provider'),
        type: 'label',
      },
      { name: 'createdAt', title: t('fields.created_at'), type: 'time' },
    ],
    data: payments,
    pagination: {
      total,
      page,
      limit,
    },
  };

  return (
    <>
      <Header crumbs={crumbs} />
      <Main>
        <MainHeader
          title={t('list.title')}
          tabs={tabs}
          filters={filters}
          search={search}
        />
        
        {/* Payment Summary Statistics */}
        <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Revenue */}
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {t('summary.total_revenue')}
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  ${(totalRevenue / 100).toFixed(2)}
                </p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Subscription Orders */}
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {t('summary.subscriptions')}
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {subscriptionOrders.length}
                </p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* One-time Orders */}
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {t('summary.one_time')}
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {oneTimeOrders.length}
                </p>
              </div>
              <div className="rounded-full bg-purple-100 p-3">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Unique Customers */}
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {t('summary.customers')}
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {uniqueCustomers}
                </p>
              </div>
              <div className="rounded-full bg-orange-100 p-3">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <TableCard table={table} />
      </Main>
    </>
  );
}
