/**
 * Shopify Service
 * Handle Shopify API calls
 */

interface ShopifyConfig {
  shop: string;
  accessToken: string;
}

export class ShopifyService {
  private shop: string;
  private accessToken: string;
  private apiVersion = '2024-01';

  constructor(config: ShopifyConfig) {
    this.shop = config.shop;
    this.accessToken = config.accessToken;
  }

  /**
   * Make a request to Shopify API
   */
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `https://${this.shop}/admin/api/${this.apiVersion}/${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': this.accessToken,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get customers list
   */
  async getCustomers(limit = 250) {
    const data = await this.request(`customers.json?limit=${limit}`);
    return data.customers;
  }

  /**
   * Get customer by email
   */
  async getCustomerByEmail(email: string) {
    const data = await this.request(`customers/search.json?query=email:${email}`);
    return data.customers[0] || null;
  }

  /**
   * Create a discount code
   */
  async createDiscountCode(params: {
    code: string;
    valueType: 'percentage' | 'fixed_amount';
    value: number;
    usageLimit?: number;
    startsAt?: string;
    endsAt?: string;
  }) {
    const priceRule = await this.createPriceRule({
      title: params.code,
      valueType: params.valueType,
      value: params.value,
      customerSelection: 'all',
      targetType: 'line_item',
      targetSelection: 'all',
      allocationMethod: 'across',
      usageLimit: params.usageLimit || 1,
      startsAt: params.startsAt || new Date().toISOString(),
      endsAt: params.endsAt,
    });

    const data = await this.request(
      `price_rules/${priceRule.id}/discount_codes.json`,
      {
        method: 'POST',
        body: JSON.stringify({
          discount_code: {
            code: params.code,
          },
        }),
      }
    );

    return data.discount_code;
  }

  /**
   * Create a price rule (required for discount codes)
   */
  private async createPriceRule(params: {
    title: string;
    valueType: string;
    value: number;
    customerSelection: string;
    targetType: string;
    targetSelection: string;
    allocationMethod: string;
    usageLimit: number;
    startsAt: string;
    endsAt?: string;
  }) {
    const data = await this.request('price_rules.json', {
      method: 'POST',
      body: JSON.stringify({
        price_rule: {
          title: params.title,
          target_type: params.targetType,
          target_selection: params.targetSelection,
          allocation_method: params.allocationMethod,
          value_type: params.valueType,
          value: params.valueType === 'percentage' ? `-${params.value}` : `-${params.value}`,
          customer_selection: params.customerSelection,
          usage_limit: params.usageLimit,
          starts_at: params.startsAt,
          ends_at: params.endsAt,
        },
      }),
    });

    return data.price_rule;
  }

  /**
   * Get order by ID
   */
  async getOrder(orderId: string) {
    const data = await this.request(`orders/${orderId}.json`);
    return data.order;
  }

  /**
   * Get orders list
   */
  async getOrders(limit = 250, status = 'any') {
    const data = await this.request(`orders.json?limit=${limit}&status=${status}`);
    return data.orders;
  }

  /**
   * Check if discount code exists
   */
  async getDiscountCode(code: string) {
    try {
      const data = await this.request(`discount_codes/lookup.json?code=${code}`);
      return data.discount_code;
    } catch (error) {
      return null;
    }
  }
}

/**
 * Create Shopify service instance
 */
export function createShopifyService(shop: string, accessToken: string) {
  return new ShopifyService({ shop, accessToken });
}











